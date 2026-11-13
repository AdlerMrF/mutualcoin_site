---
phase: 01-foundation-shell-hero
plan: 03
subsystem: ui
tags: [hero, gsap, scrolltrigger, parallax, tailwind, vite, dark-navy]

# Dependency graph
requires:
  - phase: 01-02
    provides: shell completo (authority bar, navbar pill, scroll-spy, footer, floating CTA) e tema dark navy
provides:
  - Hero da Fase 1 em coluna única editorial "private bank" (badge, h1 com "sofisticação" em gold itálico, parágrafo único, 2 CTAs, authority strip)
  - heroTl (GSAP timeline de entrada com fade+rise+blur sequencial) e parallax sutil dos blobs no scroll (ScrollTrigger scrub)
  - Utilitários CSS do hero (hero-grid, hero-dot pulse, hero-shine) e três blobs decorativos (hero-blob-1/2/3)
affects: [Phase 2, stats, manifesto, seções superiores, MOT-01, MOT-02]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Hero coluna única centrada max-w-[820px] sem watermark M nem imagem de produto (D-06/D-07)"
    - "Authority strip no padrão de card canônico do grupo (lp-otc-mutual): magic-card dark, valores #EEF1F9, ícones azul #5B8DEF, divisores verticais"
    - "Motion conservador via GSAP timeline (.from sequencial) + parallax leve via ScrollTrigger scrub (D-08)"

key-files:
  created: []
  modified:
    - index.html
    - index.js
    - src/assets/css/styles.css

key-decisions:
  - "Authority strip reduzido de 5 para 4 items (+30, 28, 6, NDA) — usuário removeu 'Tecnologia / Grupo Mutual Capital' por não agregar"
  - "Authority items restilizados do row gold-number para o card canônico do grupo (lp-otc-mutual)"
  - "hero-sub e hero-legal-note fundidos em um parágrafo único encurtado; hero-legal-note não existe mais"
  - "'sofisticação' em itálico gold (o plano original pedia not-italic) — pedido do usuário"
  - "h1 ajustado para text-[28px]/sm:[38px]/lg:[52px] font-semibold (menor e mais pesado que os 60px font-medium do plano)"

patterns-established:
  - "Hero editorial private-bank: grid bg sutil + blobs em camadas + fade inferior para #0C1220"
  - "Authority strip = card canônico do grupo (não row de números soltos)"

requirements-completed: [SEC-01, MOT-03]

# Metrics
duration: ~3h (inclui revisão interativa extensa do usuário)
completed: 2026-06-16
---

# Phase 1 Plan 03: Hero Summary

**Hero editorial "private bank" em coluna única (badge, h1 com "sofisticação" em gold itálico, parágrafo único, 2 CTAs, authority strip de 4 cards) sobre fundo dark com blobs decorativos, entrada GSAP sequencial e parallax sutil no scroll.**

## Performance

- **Duration:** ~3h (Tasks 1-2 + revisão interativa intensa do hero pelo usuário)
- **Started:** Task 1 commit 6e1c502
- **Completed:** 2026-06-16
- **Tasks:** 2 auto + 1 checkpoint human-verify (blocking) aprovado
- **Files modified:** 3 (index.html, index.js, src/assets/css/styles.css)

## Accomplishments

- Hero coluna única centrada (max-w-[820px]) com estética editorial private-bank: badge opaco, h1 com ênfase gold em "sofisticação", parágrafo de subtexto único, 2 CTAs (Ver Soluções gold + Iniciar uma Conversa outline) e authority strip
- Sem watermark "M" gigante nem imagem de produto (D-06/D-07) — apenas grid de fundo sutil + três blobs decorativos em camadas (azul/azul/cyan) + fade inferior para #0C1220
- Authority strip entregue como card canônico do grupo (padrão lp-otc-mutual): magic-card dark, 4 colunas com ícones azul #5B8DEF, valores #EEF1F9 font-medium e divisores verticais
- MOT-03: heroTl anima a entrada sequencial (fade + rise + blur) de badge → título → sub → CTAs → strip; os três blobs entram em fade e fazem parallax sutil no scroll via ScrollTrigger scrub
- Encerra a Fase 1: a página abre completa no navegador (authority bar + navbar pill + hero + footer + floating CTA), coesa no tema dark navy

## Task Commits

Tasks atômicos:

1. **Task 1: Markup do hero (coluna única, blobs, copy v4)** - `6e1c502` (feat)
2. **Task 2: Motion do hero — heroTl entrada + parallax dos blobs (MOT-03)** - `ab2874c` (feat)

Refinamentos diretos durante a revisão interativa do usuário (fora do fluxo GSD, aplicados ao hero aprovado):

- `9b247a5` style — refino editorial private-bank da hero section
- `d65990d` style — h1 menor (52px) + semibold + remove hero-shine do markup
- `0a984dc` style — sofisticação em itálico
- `8e6bfb1` style — remove brilho gold do blob-2, substitui por azul
- `35e4bfc` copy — funde hero-sub e hero-legal-note em parágrafo único
- `338cd04` style — aumenta padding-left do botão secundário (pl-12)
- `365ce0d` style — badge fundo opaco + remove dot gold
- `b8432fc` copy — encurta hero-sub (remove redundâncias, mantém persuasão)
- `5ca147a` style — authority strip lado a lado (5 col) no padrão do grupo
- `668d018` style — valores do strip em font-medium (era semibold)
- `8c6e327` style — coluna Tecnologia mais larga + ícones azul claro #5B8DEF
- `3b05a61` style — reduz largura da coluna Tecnologia (1.35fr → 1.15fr)
- `bf96d91` style — remove coluna Tecnologia/Grupo Mutual Capital — strip com 4 items

## Files Created/Modified

- `index.html` - Markup do `#hero`: grid de fundo, três blobs (hero-blob-1/2/3), fade inferior, badge, h1 com `<em>` gold itálico, parágrafo único, 2 CTAs, authority strip de 4 cards
- `index.js` - heroTl (timeline de entrada sequencial) + entrada em fade dos blobs + parallax dos três blobs via ScrollTrigger scrub + ScrollTrigger.refresh()
- `src/assets/css/styles.css` - Utilitários do hero: `.hero-grid` (background grid sutil), `.hero-dot` (pulse), `.hero-shine` (keyframe) + guards `prefers-reduced-motion`

## Decisions Made

- Authority strip no padrão de card canônico do grupo (lp-otc-mutual) em vez de row de números soltos — coerência visual com as demais LPs do grupo
- Strip reduzido a 4 items pelo usuário (+30, 28, 6, NDA), removendo "Tecnologia / Grupo Mutual Capital"
- h1 menor e mais pesado (52px semibold) que o plano original (60px font-medium) — escolha editorial do usuário
- "sofisticação" em itálico gold (plano pedia not-italic) — pedido do usuário

## Deviations from Plan

Todas as deviações abaixo emergiram da revisão interativa do hero conduzida pelo usuário e foram explicitamente aprovadas no checkpoint blocking human-verify.

### Auto-fixed / User-approved Issues

**1. [Rule 4 - User-approved scope reduction] Authority strip de 5 → 4 items**
- **Found during:** Revisão interativa (checkpoint human-verify)
- **Issue:** Plano e UI-SPEC especificavam 5 authority items; o 5º item ("Tecnologia / Grupo Mutual Capital") não agregava informação meaningful para o usuário
- **Fix:** Removida a coluna "Tecnologia / Grupo Mutual Capital"; strip final com 4 items (+30 Jurisdições mapeadas, 28 Perfis de cliente mapeados, 6 Pilares de inteligência, NDA Confidencialidade por padrão)
- **Files modified:** index.html
- **Verification:** Hero renderiza grid de 4 colunas; checkpoint aprovado pelo usuário
- **Committed in:** bf96d91 (+ 5ca147a, 668d018, 8c6e327, 3b05a61 da reconstrução do strip)

**2. [Rule 4 - User-approved restyle] Authority items → card canônico do grupo**
- **Found during:** Revisão interativa
- **Issue:** Plano especificava row de números soltos (valor gold + label); o padrão visual do grupo usa card magic-card
- **Fix:** Strip reconstruído no padrão lp-otc-mutual — magic-card dark (#0D1525), valores brancos #EEF1F9 font-medium, ícones azul #5B8DEF, divisores verticais entre colunas
- **Files modified:** index.html
- **Verification:** Checkpoint aprovado
- **Committed in:** 5ca147a, 668d018, 8c6e327

**3. [Rule 4 - User-approved copy merge] hero-sub + hero-legal-note fundidos**
- **Found during:** Revisão interativa
- **Issue:** Plano previa dois elementos separados (`.hero-sub` + `.hero-legal-note`); resultou redundante
- **Fix:** Fundidos em um único parágrafo `.hero-sub`, depois encurtado para remover redundâncias mantendo persuasão. O elemento `.hero-legal-note` não existe mais no markup
- **Files modified:** index.html
- **Verification:** Checkpoint aprovado
- **Committed in:** 35e4bfc, b8432fc

**4. [Rule 4 - User-approved style] "sofisticação" em itálico gold**
- **Found during:** Revisão interativa
- **Issue:** Plano (D-09) pedia `not-italic`; usuário preferiu itálico
- **Fix:** `<em class="text-[#FCB71B]">sofisticação</em>` em itálico gold
- **Files modified:** index.html
- **Committed in:** 0a984dc

**5. [Rule 4 - User-approved style] h1 menor e mais pesado**
- **Found during:** Revisão interativa
- **Issue:** Plano pedia text-[34px]/sm:[44px]/lg:[60px] font-medium
- **Fix:** Ajustado para text-[28px]/sm:[38px]/lg:[52px] font-semibold leading-[1.1]
- **Files modified:** index.html
- **Committed in:** d65990d

**6. [Refinement] Background editorial: grid + blobs em camadas + fade inferior**
- **Found during:** Revisão interativa
- **Issue:** Plano previa apenas 2 blobs (azul + gold)
- **Fix:** Adicionado `.hero-grid` (background grid sutil), três blobs (hero-blob-1 azul, hero-blob-2 azul, hero-blob-3 cyan #11CFFA) substituindo o blob gold, fade inferior para #0C1220. O blob-3 tem entrada em fade e parallax próprios no index.js. Utilitários `.hero-dot` (pulse) e `.hero-shine` (keyframe) adicionados ao styles.css
- **Files modified:** index.html, index.js, src/assets/css/styles.css
- **Committed in:** 9b247a5, 8e6bfb1, d65990d

---

**Total deviations:** 6 (todas user-approved no checkpoint blocking human-verify).
**Impact on plan:** Refinamentos editoriais do hero conduzidos pelo usuário; entregam SEC-01 e MOT-03 com qualidade superior ao plano original. Nenhum scope creep não-aprovado.

## Known Stubs / Dead Selectors

- `index.js` heroTl ainda referencia `.hero-legal-note` (linha 170), elemento removido no merge do parágrafo. GSAP no-op em seletor inexistente (null-guard implícito) — sem erro de runtime; é selector morto a ser limpo num polish futuro (não bloqueante).
- `src/assets/css/styles.css` retém `.hero-shine` (keyframe lines 184-194) e `.hero-dot` (pulse) — ambos removidos do markup atual (dot do badge e shine do gold removidos). CSS órfão inofensivo (não referenciado), passível de limpeza no polish da Fase 4.

## Issues Encountered

- Revisão interativa extensa do hero pelo usuário (muitas iterações de copy, tipografia, blobs e authority strip) — todas resolvidas dentro do checkpoint e aprovadas.

## User Setup Required

None - nenhuma configuração de serviço externo.

## Next Phase Readiness

- Fase 1 inteira concluída (3/3 plans): foundation + shell + hero renderizam coesos no tema dark navy.
- Pronto para Fase 2 (Seções Superiores): stats, manifesto, positioning, solutions, profiles, jurisdictions, global presence — com reveals GSAP (MOT-01/MOT-02).
- Atenção para a Fase 2: a faixa de stats usa +40 (hero usa +30 — não confundir).
- Polish futuro: limpar selector morto `.hero-legal-note` no heroTl e CSS órfão `.hero-shine`/`.hero-dot`.

## Self-Check: PASSED

- SUMMARY.md presente
- Commits verificados: 6e1c502 (Task 1), ab2874c (Task 2), bf96d91 (último refinamento do strip)

---
*Phase: 01-foundation-shell-hero*
*Completed: 2026-06-16*
