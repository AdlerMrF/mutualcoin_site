# Mutual Advisory — Landing Page

## What This Is

Landing page institucional da **Mutual Advisory**, vertical de inteligência patrimonial do Grupo Mutual Capital. Página única (one-page) que apresenta soluções de estruturação patrimonial, blindagem de ativos, expansão global e ativos digitais para um público de alto patrimônio (HNWI/UHNWI), empresários e family offices. Construída em Vite vanilla, reaproveitando o padrão de UI das demais landing pages do grupo, com identidade dark navy e motion sutil via GSAP.

## Core Value

A página precisa **carregar extremamente rápido** e apresentar a copy institucional (palavra-por-palavra do material aprovado) com a sofisticação visual do padrão Mutual — convertendo visitantes em conversas confidenciais via WhatsApp/e-mail.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Reproduzir as 19 seções da copy v4 palavra-por-palavra
- [ ] Identidade visual dark navy do grupo (#0C1220 / #FCB71B / Montserrat), re-tematizando a copy original light/serif
- [ ] Reaproveitar padrões de UI das LPs existentes (navbar pill, cards, footer, stats)
- [ ] Motion sutil via GSAP + ScrollTrigger (reveals, counters, parallax leve)
- [ ] Form de contato envia via WhatsApp + mailto (sem backend)
- [ ] Carregamento extremamente rápido (Lighthouse alto, LCP < 2.5s)
- [ ] Responsivo (desktop, tablet, mobile)
- [ ] Acessibilidade básica (contraste AA, navegação por teclado, aria em ícones)

### Out of Scope

- Tradução EN — toggle PT|EN fica visível mas inativo no lançamento; traduzir 1971 linhas exigiria esforço próprio
- Backend / banco / API própria — LP estática; form usa WhatsApp + mailto
- CMS / conteúdo dinâmico — copy fixa no HTML
- Splash screen animado pesado — opcional, não prioritário (conflita com carregamento rápido)

## Context

- **Ecossistema mapeado** em `.planning/codebase/` (7 docs). Mapa Seção→Padrão em `CONCERNS.md`, design system dark em `CONVENTIONS.md`, plano de migração de motion em `ARCHITECTURE.md`.
- **Copy-fonte:** `../mutual advisory site v4.html` (1971 linhas, light/cream serif — será re-tematizada para dark).
- **LPs de referência** (mesmo workspace): `lp-otc-mutual` e `lp-mutual-capital` (Vite vanilla = base técnica); `lp-mutual-otc` e `front-nextjs-lpmutual` (Next.js = referência de UI/seções).
- **Pasta-alvo** `lp-mutual-advisory` estava vazia (só `.git`).
- Página é longa (19 seções, 28 ICP cards, 12 jurisdições) → DOM pesado é o principal risco de performance; mitigar com reveal lazy via ScrollTrigger.

## Constraints

- **Tech stack**: Vite + Tailwind + Lenis + GSAP/ScrollTrigger — espelhar `lp-otc-mutual`/`lp-mutual-capital` (HTML monolítico + index.js)
- **Conteúdo**: copy idêntica palavra-por-palavra do HTML v4 — sem reescrita
- **Identidade**: dark navy do grupo (#0C1220, #FCB71B, #111D35, #1B2A46, #EEF1F9, #8898C0, Montserrat)
- **Performance**: carregamento extremamente rápido é requisito de primeira ordem
- **Idioma**: PT apenas no lançamento

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Vite vanilla (não React/Next) | Espelha as LPs Vite do grupo; mais leve/rápido para LP estática | — Pending |
| Motion engine = GSAP + ScrollTrigger | Pedido do usuário; substitui IntersectionObserver+CSS das refs | — Pending |
| Identidade dark navy do grupo (não light serif do v4) | Consistência visual com o ecossistema Mutual | — Pending |
| Form via WhatsApp + mailto | LP estática sem backend; go-live rápido | — Pending |
| Só PT no lançamento | Evitar traduzir toda a copy; escopo enxuto | — Pending |
| Copy palavra-por-palavra | Material institucional aprovado | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-06-16 after initialization*
