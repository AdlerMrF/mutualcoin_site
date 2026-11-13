---
phase: 01-foundation-shell-hero
plan: 02
subsystem: ui
tags: [vite, tailwind, gsap, scrolltrigger, lenis, navbar, footer, scroll-spy]

# Dependency graph
requires:
  - phase: 01-01
    provides: scaffold Vite + design system dark (tokens #0C1220/#FCB71B/Montserrat) + Lenis/GSAP/ScrollTrigger inicializados no index.js
provides:
  - Authority bar fixa no topo (copy v4 exata) que some ao rolar (SHL-01)
  - Navbar pill frosted-glass do grupo com logo (ícone Mutual + textual) + 7 links + CTA, colapsando ao scroll (SHL-02)
  - Scroll-spy destacando a seção ativa via classe nav-link-active (SHL-03)
  - Footer 4 colunas (brand + Soluções + Perfis + Legal e Grupo) + bottom bar + 4 parágrafos de disclaimer (SHL-04)
  - Floating CTA circular (FAB) que surge após ~600px de scroll (SHL-05)
  - Menu hamburguer mobile com aria-expanded + Escape + fecha no scroll
  - Anchor smooth-scroll via Lenis.scrollTo para todos os a[href^="#"]
affects: [hero (01-03), seções superiores (Phase 2), seções inferiores (Phase 3), contato (Phase 4)]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Navbar pill via applyNavState(scrolled) com cache prevScrolled, disparada por ScrollTrigger (não window listener) para integrar com Lenis"
    - "Scroll-spy por ScrollTrigger.create em cada section[id] alternando classe nav-link-active"
    - "Floating CTA / authority-bar hide via ScrollTrigger onEnter/onLeaveBack com gsap.to"
    - "Padding lateral dinâmico do navbar (40px expandido → 16px colapsado) para alinhar logo/CTA à margem de conteúdo"

key-files:
  created:
    - src/assets/img/iconeMutual.svg
  modified:
    - index.html
    - index.js

key-decisions:
  - "Pill colapsada alinhada ao canônico do grupo (1150px / border-radius 1rem) em vez dos 860px/9999px da UI-SPEC — os valores da UI-SPEC eram defeito (não comportavam 7 links + logo + CTA)"
  - "Navbar offset top:36px (expandido) → 0 (colapsado) para ficar abaixo da authority bar — omitido pela UI-SPEC, causava overlap"
  - "Ícone Mutual (iconeMutual.svg, reaproveitado de front-nextjs-lpmutual) adicionado ao logo da navbar, brand do footer e ao floating CTA"
  - "Sublabel 'Inteligência Patrimonial Global' removida da navbar E do footer a pedido do usuário (mantida só em <title>)"
  - "Toggle PT|EN removido inteiramente do header a pedido do usuário — redução de escopo de SHL-02 (controle inativo v2-deferred de qualquer forma)"
  - "Floating CTA convertido de pill texto+dot para FAB circular icon-only (56x56) preservando aria-label"

patterns-established:
  - "Navbar pill: applyNavState central + ScrollTrigger start 'top -80px'"
  - "Authority bar: ScrollTrigger start 'top -60px' fade+translateY"
  - "Scroll-spy: ScrollTrigger por section, classe nav-link-active única"
  - "Anchor scroll: lenis.scrollTo com offset -(navHeight + 8)"

requirements-completed: [SHL-01, SHL-02, SHL-03, SHL-04, SHL-05]

# Metrics
duration: ~2h (com ciclo de checkpoint/refinamento)
completed: 2026-06-16
---

# Phase 1 Plano 02: Shell persistente Summary

**Shell persistente da LP — authority bar que some ao rolar, navbar pill frosted-glass com ícone Mutual + 7 links + CTA, scroll-spy, footer de 4 colunas com disclaimer e floating CTA circular — tudo com copy v4 palavra-por-palavra e motion via GSAP/ScrollTrigger integrado ao Lenis.**

## Performance

- **Duration:** ~2h (incluindo ciclo de checkpoint human-verify + refinamentos solicitados)
- **Started:** 2026-06-16T17:30:00Z (aprox.)
- **Completed:** 2026-06-16T19:30:00Z
- **Tasks:** 2 (auto) + 1 checkpoint human-verify (aprovado)
- **Files modified:** 3 (index.html, index.js, + src/assets/img/iconeMutual.svg criado)

## Accomplishments
- Authority bar fixa no topo com a copy v4 exata ("Mutual Advisory · Membro do Grupo Mutual Capital · ... · mutualcapital.com.br →"), link externo com `rel="noopener noreferrer"` (SEC-01); some ao rolar via ScrollTrigger
- Navbar pill do grupo: logo (ícone Mutual + "Mutual Advisory") + 7 links de nav + CTA gold "Iniciar Conversa"; colapsa para pill central frosted-glass ao rolar >80px e fica abaixo da authority bar
- Scroll-spy destacando a seção ativa na navbar (classe `nav-link-active`) via ScrollTrigger por `section[id]`
- Footer de 4 colunas (brand + Soluções + Perfis + Legal e Grupo) + bottom bar de copyright + 4 parágrafos de disclaimer legal com copy v4
- Floating CTA circular (FAB icon-only 56x56) surgindo após ~600px de scroll, com aria-label preservado
- Menu hamburguer mobile (abre/fecha, aria-expanded, Escape, fecha no scroll) e anchor smooth-scroll via `lenis.scrollTo`

## Task Commits

1. **Task 1: Authority bar + Navbar pill (markup + JS pill/mobile)** - `957cba7` (feat)
2. **Task 2: Footer + Floating CTA + scroll-spy + anchor scroll** - `0fd32f1` (feat)

**Checkpoint refinements (durante human-verify, antes da aprovação):**

- `c9c1f5c` (fix) - navbar offset abaixo da authority bar (top 36→0 no colapso)
- `5f7f1a6` (fix) - alinha pill colapsada ao canônico do grupo (1150px/1rem, nowrap nos links)
- `f1bb432` (fix) - CTA nowrap para ficar em uma linha na pill
- `1394802` (feat) - ícone Mutual no logo da navbar + footer
- `df68c60` (style) - navbar spacing — divisor entre toggle e nav links, gaps uniformes
- `8f9cdac` (style) - remove sublabel do logo e toggle PT|EN do header
- `f0fa5df` (style) - aproxima logo da borda esquerda do navbar
- `9ec6fbf` (style) - padding lateral dinâmico do navbar + remove divisor órfão
- `9f0f17e` (style) - remove sublabel "Inteligência Patrimonial Global" do footer
- `a0a34eb` (style) - ícone Mutual no botão flutuante "Iniciar Conversa"
- `678e15f` (style) - float-cta vira botão circular só com ícone Mutual

## Files Created/Modified
- `src/assets/img/iconeMutual.svg` - Ícone "M" Mutual (gold #FCB71B) reaproveitado de front-nextjs-lpmutual; usado no logo da navbar, brand do footer e floating CTA
- `index.html` - Markup: #authority-bar, header/navbar pill (logo + 7 links + CTA + hamburger + #mobile-menu), footer 4 colunas + disclaimer, #float-cta (FAB circular)
- `index.js` - applyNavState (pill), authority-bar hide, scroll-spy, floating CTA trigger, anchor smooth-scroll, mobile menu toggle (aria-expanded + Escape)

## Decisions Made
- Pill colapsada alinhada ao canônico do grupo (1150px / border-radius 1rem) em vez de 860px/9999px da UI-SPEC — a navbar Advisory tem 7 links + logo + CTA que não cabiam na pill estreita
- Navbar offset top:36px (expandido) → 0 (colapsado) para sentar abaixo da authority bar — omissão da UI-SPEC corrigida
- Ícone Mutual adicionado ao logo (navbar + footer) e ao FAB
- Sublabel removida de navbar e footer (mantida só no `<title>`) — pedido do usuário
- Toggle PT|EN removido do header — pedido do usuário (redução de escopo de SHL-02)
- Floating CTA convertido em FAB circular icon-only — pedido do usuário

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Overlap authority bar × navbar (offset top ausente)**
- **Found during:** Checkpoint human-verify (Task 1/2)
- **Issue:** A UI-SPEC não definiu offset vertical da navbar; com a authority bar fixa no topo, a navbar sobrepunha a faixa de autoridade no estado expandido
- **Fix:** Navbar `top:36px` (expandido) animando para `0` no colapso, integrado ao applyNavState (transição 380ms)
- **Files modified:** index.html, index.js
- **Verification:** Visual no checkpoint — authority bar visível e navbar abaixo dela no topo; pill central ao rolar
- **Committed in:** `c9c1f5c`

**2. [Rule 1 - Bug] Pill colapsada com dimensões defeituosas na UI-SPEC**
- **Found during:** Checkpoint human-verify (Task 1)
- **Issue:** UI-SPEC especificava 860px / border-radius 9999px (rounded-full); a navbar Advisory tem 7 links + logo + CTA que não cabem nessa largura — quebrava o layout
- **Fix:** Pill colapsada alinhada ao canônico do grupo (lp-otc-mutual): max-width 1150px, border-radius 1rem, `whitespace-nowrap` nos 7 links. Os valores da UI-SPEC eram defeito; o canônico do grupo é a fonte de verdade correta
- **Files modified:** index.html, index.js
- **Verification:** Visual no checkpoint — pill comporta todos os elementos em uma linha
- **Committed in:** `5f7f1a6`, `f1bb432`

### User-Requested Changes (no checkpoint, antes da aprovação)

Mudanças solicitadas pelo usuário durante a verificação humana — refinamentos de polish e uma redução de escopo aprovada:

**3. Remoção da sublabel "Inteligência Patrimonial Global"**
- Removida do logo da navbar e do brand do footer; mantida apenas no `<title>` da página
- **Committed in:** `8f9cdac` (navbar), `9f0f17e` (footer)

**4. Remoção do toggle PT|EN do header (redução de escopo de SHL-02)**
- O plano (e a truth D-03) especificava o toggle PT|EN com EN inativo. A pedido do usuário, o toggle foi removido inteiramente do header
- **Nota de escopo:** SHL-02 originalmente incluía o toggle; ele era um controle inativo já deferido para v2 (I18N-01 no Deferred Items). A remoção visual é uma redução de escopo aprovada pelo usuário, não um requisito não atendido
- **Committed in:** `8f9cdac`

**5. Ícone Mutual no logo, footer e FAB**
- Asset `iconeMutual.svg` (reaproveitado de front-nextjs-lpmutual) adicionado ao lockup do logo na navbar, brand do footer e ao floating CTA
- **Nota:** asset novo não constava em `files_modified` do plano original — registrado aqui
- **Committed in:** `1394802` (navbar+footer), `a0a34eb` + `678e15f` (FAB)

**6. Padding lateral dinâmico do navbar**
- Padding lateral 40px (expandido) → 16px (colapsado) para alinhar logo/CTA à margem de conteúdo; logo aproximado da borda esquerda; divisor órfão removido
- **Committed in:** `f0fa5df`, `9ec6fbf`, `df68c60`

**7. Floating CTA → FAB circular icon-only**
- Convertido do pill texto+dot para botão circular (56x56) apenas com o ícone Mutual; `aria-label` preservado para acessibilidade
- **Committed in:** `a0a34eb`, `678e15f`

---

**Total deviations:** 2 auto-fixed (2 bugs de defeito na UI-SPEC) + 5 mudanças solicitadas pelo usuário no checkpoint
**Impact on plan:** Os auto-fixes corrigiram defeitos da UI-SPEC necessários para o layout funcionar. As mudanças do usuário são refinamentos de polish; a única redução de escopo (toggle PT|EN) atinge um controle já deferido para v2. SHL-01..05 entregues.

## Issues Encountered
- A pill canônica de 860px da UI-SPEC não comportava a navbar densa do Advisory (7 links) — resolvido alinhando ao canônico real do grupo (1150px). Documentado como defeito da UI-SPEC.

## User Setup Required
None - nenhuma configuração de serviço externo necessária.

## Known Stubs
- Toggle PT|EN: removido visualmente (não é stub — controle deferido para v2 / I18N-01). Sem stubs de dados pendentes.

## Next Phase Readiness
- Shell persistente completo; pronto para o Plano 01-03 (hero coluna única + motion GSAP entrance/parallax)
- Os anchors de seção (#solutions, #profiles, #icp, #jurisdictions, #technology, #how, #contact) já existem como alvos de scroll; serão preenchidos com conteúdo nas Fases 2-3
- Padrões de navbar/scroll-spy/anchor estabelecidos para as fases seguintes

## Self-Check: PASSED

- SUMMARY.md present
- src/assets/img/iconeMutual.svg present
- All 13 implementation/refinement commits verified in git (957cba7, 0fd32f1, c9c1f5c, 5f7f1a6, f1bb432, 1394802, df68c60, 8f9cdac, f0fa5df, 9ec6fbf, 9f0f17e, a0a34eb, 678e15f)

---
*Phase: 01-foundation-shell-hero*
*Completed: 2026-06-16*
