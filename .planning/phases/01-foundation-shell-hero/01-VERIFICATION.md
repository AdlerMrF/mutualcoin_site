---
phase: 01-foundation-shell-hero
verified: 2026-06-16T18:05:00Z
status: human_needed
score: 16/16 must-haves verified
overrides_applied: 0
overrides:
  - must_have: "SHL-02: navbar mostra toggle PT|EN (EN desabilitado)"
    reason: "Toggle PT|EN removido a pedido do usuário na revisão interativa — controle inativo, diferido para v2 (I18N-01). Restante de SHL-02 (logo, 7 links, CTA, colapso pill) entregue. Redução de escopo aprovada pelo usuário."
    accepted_by: "gustavo.brandao"
    accepted_at: "2026-06-16T18:05:00Z"
  - must_have: "SEC-01: hero contém 5 authority items (+30, 28, 6, Tecnologia, NDA)"
    reason: "Strip de autoridade reduzida de 5 para 4 itens (+30, 28, 6, NDA) — usuário removeu 'Tecnologia/Grupo Mutual Capital'. hero-legal-note mesclada ao hero-sub. Sublabel 'Inteligência Patrimonial Global' removida do logo da navbar/footer. Redução de escopo aprovada pelo usuário."
    accepted_by: "gustavo.brandao"
    accepted_at: "2026-06-16T18:05:00Z"
human_verification:
  - test: "Scroll com a roda do mouse na página"
    expected: "Inércia suave do Lenis (não scroll bruto nativo); sem erros vermelhos no console (gsap/lenis/ScrollTrigger)"
    why_human: "Comportamento de scroll em tempo real e console do browser não verificáveis por grep — verificado e aprovado pelo usuário no checkpoint do Plano 01"
  - test: "Rolar >80px e observar a navbar"
    expected: "Authority bar some; navbar colapsa para pill central frosted-glass (max-width ~1150px, rounded, blur, sombra) com transição de 380ms"
    why_human: "Animação de colapso/frosted-glass é visual e dependente de scroll — verificada e aprovada pelo usuário no checkpoint do Plano 02"
  - test: "Rolar levemente e observar os blobs de fundo do hero"
    expected: "Blobs deslocam de forma sutil (parallax scrub), mais lentos que o conteúdo"
    why_human: "Parallax contínuo via ScrollTrigger scrub é visual em tempo real — verificado e aprovado pelo usuário no checkpoint do Plano 03"
  - test: "Reduzir a janela para <768px e testar o menu hamburguer"
    expected: "Navbar mostra só logo + hamburguer; abre/fecha no clique, fecha ao clicar num link, fecha com Escape, fecha ao rolar >200px"
    why_human: "Interação de UI responsiva em runtime — verificada e aprovada pelo usuário no checkpoint do Plano 02"
  - test: "Clicar num link da navbar / botão do hero"
    expected: "Scroll suave até a section; link da section ativa destacado em dourado (scroll-spy)"
    why_human: "Smooth-scroll e scroll-spy em runtime — verificados e aprovados pelo usuário nos checkpoints"
---

# Phase 1: Foundation + Shell + Hero Verification Report

**Phase Goal:** A página abre no navegador com identidade dark navy completa, scroll suave e as estruturas persistentes (authority bar, navbar pill, footer, floating CTA) visíveis — mais o hero com eyebrow, h1, hero-sub, botões e authority items renderizando.
**Verified:** 2026-06-16T18:05:00Z
**Status:** human_needed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| #   | Truth | Status | Evidence |
| --- | ----- | ------ | -------- |
| 1   | npm run dev sobe o Vite / build resolve sem erro | ✓ VERIFIED | `npx vite build` exit 0, 10 módulos transformados, dist gerado |
| 2   | Página abre com fundo #0C1220 e Montserrat carregada | ✓ VERIFIED | styles.css `--dark-bg: #0C1220` + `body { background-color: var(--dark-bg) }` + `* { font-family: 'Montserrat' }`; index.html link Google Fonts Montserrat `&display=swap` |
| 3   | Lenis ativo + GSAP/ScrollTrigger registrados sem erro | ✓ VERIFIED | index.js: `new Lenis({lerp:0.1,smoothWheel:true,duration:1.2})`, `gsap.registerPlugin(ScrollTrigger)`, ticker co-op + scrollerProxy; build resolve imports (console em runtime — human-verified) |
| 4   | Tailwind processa classes (purge → index.html + index.js) | ✓ VERIFIED | tailwind.config.js content `['./index.html','./index.js','./src/**/*.{js,html}']`; CSS bundle 21.74kB gerado |
| 5   | Authority bar no topo com copy v4 + some ao rolar | ✓ VERIFIED | index.html `#authority-bar` com "Membro do Grupo Mutual Capital" + link `mutualcapital.com.br →` (rel noopener); index.js ScrollTrigger `start:'top -60px'` → `gsap.to('#authority-bar',{opacity:0,y:-36})` |
| 6   | Navbar: logo + 7 links + CTA; colapsa para pill ao rolar | ✓ VERIFIED (override p/ toggle PT\|EN) | 6 IDs navbar presentes; 7 nav links (#solutions…#contact); logo `Mutual <em>Advisory</em>` gold; CTA "Iniciar Conversa"; `applyNavState` com 1150px/9999px-equiv(1rem)/rgba(11,16,32,0.82)/blur. Toggle PT\|EN removido — override aprovado |
| 7   | Scroll-spy destaca a section ativa | ✓ VERIFIED | index.js `setActiveLink` toggle `nav-link-active` por `section[id]` ScrollTrigger; `.nav-link-active{color:#FCB71B}` em styles.css |
| 8   | Footer 4 colunas + bottom bar + 4 disclaimers | ✓ VERIFIED | `<footer aria-label="Site footer">` brand + grid 4-col (Soluções/Perfis/Legal e Grupo); copyright "© 2025–2026…"; 4 `<p>` disclaimer incl. "não constituindo aconselhamento jurídico" |
| 9   | Floating CTA aparece após ~600px, fixo bottom-right | ✓ VERIFIED | `#float-cta` estado inicial opacity:0/pointer-events:none; index.js ScrollTrigger `start:'600px top'` → gsap.to opacity:1 |
| 10  | Mobile: navbar vira hamburguer (aria, Escape, fecha no scroll) | ✓ VERIFIED | `#mobile-menu-button` aria-expanded/aria-controls; open/closeMobileMenu; Escape handler; close em scroll>200px |
| 11  | Hero coluna única: eyebrow, h1 (gold "sofisticação"), sub, botões, authority items, dark | ✓ VERIFIED (override p/ 5→4 items) | `#hero` bg #0E162E; `.hero-badge`, `.hero-title` h1 `<em class="text-[#FCB71B]">sofisticação</em>`, `.hero-sub`, `.hero-ctas` (Ver Soluções + Iniciar uma Conversa), `.hero-auth` 4 items (+30,28,6,NDA) — redução aprovada |
| 12  | Blobs decorativos azul+gold no fundo, sem watermark M nem imagem produto | ✓ VERIFIED | `.hero-blob-1/2/3` (1E3490/1E3490/11CFFA) + `.hero-grid`; nenhum `<img>` de produto no #hero (só blobs/grid) |
| 13  | Elementos do hero entram com fade+rise via GSAP timeline | ✓ VERIFIED | index.js `heroTl = gsap.timeline({delay:0.1})` com `.from` em badge/title/sub/ctas/auth |
| 14  | Blobs do hero fazem parallax sutil no scroll (scrub) | ✓ VERIFIED | index.js `gsap.to('.hero-blob-1',{y:-40,scrollTrigger:{trigger:'#hero',scrub:true}})` (+blob-2/3) |
| 15  | FND-02 cumprido sem keyframes hero/scroll-behavior legados | ✓ VERIFIED | grep: nenhum `@keyframes heroEnter`, `@keyframes float`, `scroll-behavior:smooth`, `gsap.min.js` |
| 16  | Links externos com rel="noopener noreferrer" (SEC boundary) | ✓ VERIFIED | authority bar + footer Mutual Capital `target="_blank" rel="noopener noreferrer"` |

**Score:** 16/16 truths verified (2 incluem overrides aprovados pelo usuário)

### Required Artifacts

| Artifact | Expected | Status | Details |
| -------- | -------- | ------ | ------- |
| `package.json` | gsap+lenis deps; devDeps vite/tailwind/postcss/autoprefixer; sem chart.js | ✓ VERIFIED | gsap ^3.14.2, lenis ^1.3.21; sem chart.js; scripts dev/build/preview |
| `vite.config.js` | host true + allowedHosts trycloudflare | ✓ VERIFIED | defineConfig com server.host:true, allowedHosts ['.trycloudflare.com'] |
| `postcss.config.js` | tailwindcss + autoprefixer | ✓ VERIFIED | ambos os plugins presentes |
| `tailwind.config.js` | content [html,js,src] + tokens dark | ✓ VERIFIED | content correto + 10 tokens incl. dark-bg #0C1220 |
| `src/assets/css/styles.css` | :root vars + Montserrat + scrollbar + utilitários | ✓ VERIFIED | 10 vars, Montserrat global, scrollbar 4px, magic-card/shine-text/fade-in/nav-link-active |
| `index.html` | shell completo: authority/navbar/hero/footer/float-cta | ✓ VERIFIED | todos os blocos presentes; 8 section IDs; copy v4 |
| `index.js` | Lenis+GSAP init + handlers shell + heroTl + parallax | ✓ VERIFIED | init + applyNavState + scroll-spy + float + mobile + heroTl + parallax |
| `src/assets/img/favicon.ico` | favicon copiado | ✓ VERIFIED | existe (15.41kB no build) + iconeMutual.svg adicional |

### Key Link Verification

| From | To | Via | Status | Details |
| ---- | -- | --- | ------ | ------- |
| index.html | styles.css | import em index.js + link no head | ✓ WIRED | `import './src/assets/css/styles.css'` + `<link rel="stylesheet">` |
| index.js | lenis + gsap/ScrollTrigger | npm import | ✓ WIRED | imports resolvem no build (exit 0) |
| applyNavState | #navbar-center / #authority-bar | ScrollTrigger top -80/-60 | ✓ WIRED | ScrollTrigger.create presente; IDs existem no HTML |
| scroll-spy | nav a[href^='#'] .nav-link-active | ScrollTrigger por section[id] | ✓ WIRED | setActiveLink + classe definida no CSS |
| nav/CTA/float-cta | section anchors | lenis.scrollTo em a[href^='#'] | ✓ WIRED | querySelectorAll('a[href^="#"]') + lenis.scrollTo |
| heroTl | .hero-badge/title/sub/ctas/auth | gsap.timeline().from() | ✓ WIRED | seletores correspondem às classes no HTML |
| parallax | .hero-blob-1/2/3 | gsap.to scrollTrigger scrub trigger #hero | ✓ WIRED | blobs existem no HTML |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
| -------- | ------------- | ------ | ------------------ | ------ |
| index.html | conteúdo estático (copy v4) | markup inline | N/A — copy hardcoded por design (LP estática) | ✓ FLOWING (estático intencional) |

LP estática sem fonte de dados dinâmica; toda a copy é hardcoded por requisito (palavra-por-palavra v4). Não há vetor de "hollow data".

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
| -------- | ------- | ------ | ------ |
| Build de produção resolve imports/Tailwind | `npx vite build` | exit 0, 10 módulos, dist gerado | ✓ PASS |
| Sem debt markers (TODO/FIXME/XXX/HACK) | grep nos arquivos da fase | nenhum match | ✓ PASS |
| Sem keyframes/scroll-behavior legados | grep heroEnter/float/scroll-behavior | nenhum match | ✓ PASS |

### Probe Execution

Nenhum probe declarado nos PLANs e nenhum `scripts/*/tests/probe-*.sh` no projeto (LP estática, sem suíte automatizada). Verificação é build-based + inspeção de fonte. — SKIPPED (no probes; build gate é o portão).

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
| ----------- | ----------- | ----------- | ------ | -------- |
| FND-01 | 01-01 | Vite vanilla (html+js+Tailwind+PostCSS) | ✓ SATISFIED | scaffold completo; build passa |
| FND-02 | 01-01 | Design system dark CSS vars + Montserrat swap | ✓ SATISFIED | 10 vars + Montserrat display=swap |
| FND-03 | 01-01 | Lenis + GSAP/ScrollTrigger via npm | ✓ SATISFIED | imports npm + init em index.js |
| FND-04 | 01-01 | Tailwind purge (html+js) + tokens | ✓ SATISFIED | content correto + tokens |
| SHL-01 | 01-02 | Authority bar topo + link mutualcapital | ✓ SATISFIED | #authority-bar + hide ScrollTrigger |
| SHL-02 | 01-02 | Navbar logo+7 links+toggle+CTA, pill | ✓ SATISFIED (override) | toggle PT\|EN removido (aprovado); resto entregue |
| SHL-03 | 01-02 | Scroll-spy section ativa | ✓ SATISFIED | setActiveLink por section |
| SHL-04 | 01-02 | Footer 4 col + bottom + 4 disclaimers | ✓ SATISFIED | footer completo + 4 disclaimers v4 |
| SHL-05 | 01-02 | Floating CTA após ~600px | ✓ SATISFIED | #float-cta + ScrollTrigger 600px |
| SEC-01 | 01-03 | Hero eyebrow+h1+sub+nota+2 botões+authority items | ✓ SATISFIED (override) | hero completo; 4 items (era 5) + sub mesclado — aprovado |
| MOT-03 | 01-03 | Parallax/transform leve no hero | ✓ SATISFIED | heroTl + parallax scrub blobs |

Todos os 11 requirement IDs da fase contabilizados. Nenhum requirement órfão: REQUIREMENTS.md mapeia exatamente FND-01..04, SHL-01..05, SEC-01, MOT-03 para a Phase 1, todos cobertos pelos 3 PLANs.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
| ---- | ---- | ------- | -------- | ------ |
| — | — | nenhum | — | Nenhum debt marker, stub, return-empty ou placeholder. `<section id>` vazias (solutions/profiles/etc.) são âncoras intencionais para Fases 2-4, não stubs. |

As 7 sections vazias após o hero são placeholders ancoráveis por design (documentado nos PLANs); serão preenchidas nas Fases 2-4. Não constituem stubs do escopo da Fase 1.

### Human Verification Required

Comportamentos browser-only abaixo foram verificados e APROVADOS pelo usuário nos checkpoints blocking de cada plano. Registrados como human-verified (não como falhas):

1. **Scroll suave (Lenis) + console sem erros** — inércia suave ao rolar; sem erros vermelhos. Aprovado (checkpoint Plano 01).
2. **Colapso da navbar pill + hide da authority bar** — frosted-glass central ao rolar >80px. Aprovado (checkpoint Plano 02).
3. **Parallax sutil dos blobs do hero** — deslocamento lento no scroll. Aprovado (checkpoint Plano 03).
4. **Menu hamburguer mobile** — abre/fecha/Escape/fecha-no-scroll <768px. Aprovado (checkpoint Plano 02).
5. **Smooth-scroll + scroll-spy** — clique em link rola suave e destaca em gold. Aprovado (checkpoints).

### Gaps Summary

Nenhum gap bloqueante. A meta da Fase 1 é alcançada no código: o build de produção passa (exit 0), o design system dark navy está aplicado, Lenis+GSAP/ScrollTrigger inicializados, e todas as estruturas persistentes (authority bar, navbar pill, footer, floating CTA) mais o hero completo (eyebrow, h1 com "sofisticação" em gold, sub, 2 botões, authority card) estão presentes e corretamente fiados aos seus handlers de motion.

Dois desvios em relação aos must_haves originais dos PLANs são reduções de escopo explicitamente aprovadas pelo usuário na revisão interativa (registradas como overrides): (1) remoção do toggle PT|EN da navbar — controle inativo diferido para v2/I18N-01; (2) strip de autoridade do hero reduzida de 5 para 4 itens, sublabel do logo removida e hero-legal-note mesclada ao hero-sub. Nenhum dos dois compromete a meta da fase.

Status é **human_needed** porque a fase produz comportamentos browser-only (inércia de scroll, colapso pill, parallax, menu mobile, scroll-spy) que não são verificáveis programaticamente. Estes já foram verificados e aprovados pelo usuário nos checkpoints blocking de cada plano — listados acima para registro formal. Não há itens pendentes de teste; nenhum bloqueio para prosseguir à Fase 2.

---

_Verified: 2026-06-16T18:05:00Z_
_Verifier: Claude (gsd-verifier)_
