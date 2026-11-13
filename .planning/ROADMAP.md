# Roadmap: Mutual Advisory — Landing Page

## Overview

Construção de uma landing page one-page estática em Vite vanilla + Tailwind + Lenis + GSAP/ScrollTrigger para a vertical de inteligência patrimonial do Grupo Mutual Capital. As 4 fases entregam algo visível e funcional no navegador desde o início: fundação técnica + shell + hero (Fase 1), seções de conteúdo superiores (Fase 2), seções de conteúdo inferiores e pesadas (Fase 3), e formulário de contato + polish de qualidade final (Fase 4).

## Phases

**Phase Numbering:**

- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation + Shell + Hero** - Scaffold Vite, design system dark, Lenis/GSAP inicializados; authority bar, navbar, footer, floating CTA e hero renderizando no navegador (completed 2026-06-16)
- [ ] **Phase 2: Seções Superiores** - Stats, Manifesto, Positioning, Solutions, Profiles, Jurisdictions e Global Presence entregues com copy v4 e reveals GSAP
- [ ] **Phase 3: Seções Inferiores e Blocos Pesados** - Technology, Why Advisory, How it Works, ICP (28 cards lazy), Confidentiality e Regulatory Clarity completos
- [ ] **Phase 4: Contato + Quality Polish** - Form de contato funcional (WhatsApp + mailto), responsividade, Lighthouse ≥ 90, a11y e build de produção

## Phase Details

### Phase 1: Foundation + Shell + Hero

**Goal**: A página abre no navegador com identidade dark navy completa, scroll suave e as estruturas persistentes (authority bar, navbar pill, footer, floating CTA) visíveis — mais o hero com eyebrow, h1, hero-sub, botões e authority items renderizando.
**Mode:** mvp
**Depends on**: Nothing (first phase)
**Requirements**: FND-01, FND-02, FND-03, FND-04, SHL-01, SHL-02, SHL-03, SHL-04, SHL-05, SEC-01, MOT-03
**Success Criteria** (what must be TRUE):

  1. `npm run dev` sobe o projeto sem erros; a página abre em `localhost:5173` com fundo `#0C1220` e fonte Montserrat
  2. A authority bar aparece no topo com o texto correto; a navbar exibe logo, 7 links, toggle PT|EN e CTA "Iniciar Conversa" — e colapsa para pill frosted-glass após scroll
  3. O scroll-spy destaca a seção ativa na navbar ao rolar a página
  4. O hero renderiza com eyebrow, h1 com ênfase gold, hero-sub, nota legal, 2 botões e 5 authority items no tema dark; o parallax/transform leve do hero dispara via GSAP
  5. Footer com 4 colunas e disclaimer, floating CTA "Iniciar Conversa" aparece após ~600px de scroll

**Plans**: 3 plansPlans:
**Wave 1**

- [x] 01-01-PLAN.md — Walking Skeleton: scaffold Vite + design system dark + Lenis/GSAP init (FND-01..04)

**Wave 2** *(blocked on Wave 1 completion)*

- [x] 01-02-PLAN.md — Shell: authority bar, navbar pill, scroll-spy, footer, floating CTA (SHL-01..05)

**Wave 3** *(blocked on Wave 2 completion)*

- [x] 01-03-PLAN.md — Hero coluna única + motion GSAP entrance/parallax (SEC-01, MOT-03)

**UI hint**: yes

### Phase 2: Seções Superiores

**Goal**: As sete seções de conteúdo do topo (stats até global presence) estão completas com copy v4 palavra-por-palavra, re-tematizadas para dark, e cada uma revela suavemente ao entrar no viewport via GSAP ScrollTrigger.
**Mode:** mvp
**Depends on**: Phase 1
**Requirements**: SEC-02, SEC-03, SEC-04, SEC-05, SEC-06, SEC-07, SEC-08, MOT-01, MOT-02
**Success Criteria** (what must be TRUE):

  1. A faixa de números (6 stats) exibe contadores animados disparados ao entrar no viewport, com os valores corretos: +40, 6, 28, 16, NDA, 24h
  2. Manifesto (6 linhas 01–06), Positioning (split do/dont), Solutions (6 cards), Profiles (6 cards com badge/features) e Global Presence (9 tags) renderizam com a copy v4 intacta e tema dark
  3. Jurisdictions renderiza os 12 cards (região, nome, classes, usos, nota) + bloco "rede além das 12" no grid responsivo
  4. Cada seção revela seus elementos (cards, listas, títulos) com fade/translateY ao se aproximar do viewport via GSAP ScrollTrigger batch — sem flash de conteúdo não estilizado

**Plans**: 3 plans

**Wave 1**

- [ ] 02-01-PLAN.md — Fundação de motion (reveal batch + counters + magic-card + reduced-motion) + Stats (SEC-02) + Manifesto (SEC-03)

**Wave 2** *(blocked on Wave 1 — compartilha index.html/index.js)*

- [ ] 02-02-PLAN.md — Positioning (SEC-04) + Solutions (SEC-05) + Profiles (SEC-06)

**Wave 3** *(blocked on Wave 2 — compartilha index.html)*

- [ ] 02-03-PLAN.md — Jurisdictions 12 cards (SEC-07) + Global Presence (SEC-08)

**UI hint**: yes

### Phase 3: Seções Inferiores e Blocos Pesados

**Goal**: As seis seções restantes de conteúdo estão completas, incluindo os blocos de DOM pesado (28 ICP cards em 7 categorias e 4 tech cards + 16 módulos), com lazy reveal por categoria para preservar performance.
**Mode:** mvp
**Depends on**: Phase 2
**Requirements**: SEC-09, SEC-10, SEC-11, SEC-12, SEC-13, SEC-14, SEC-15, MOT-04
**Success Criteria** (what must be TRUE):

  1. Technology renderiza 4 tech cards + painel de integração com 16 módulos Mutual Capital no layout correto (split 2 colunas desktop)
  2. Why Advisory (6 cards ícone+título+desc), How it Works (4 steps numerados) e Confidentiality (3 itens NDA/LGPD/Vault) renderizam com copy v4 e tema dark
  3. ICP exibe as 8 perguntas provocativas + os 28 cards distribuídos em 7 categorias com label; os cards de cada categoria revelam via GSAP ScrollTrigger somente ao se aproximar do viewport (lazy reveal por categoria)
  4. Regulatory Clarity exibe texto em 2 colunas + 5 linhas de responsabilidade no tema dark
  5. Toda a copy da LP (SEC-15) reproduz palavra-por-palavra o HTML v4 re-tematizado — sem quebra de ritmo vertical (Montserrat, line-height, letter-spacing corretos)

**Plans**: TBD
**UI hint**: yes

### Phase 4: Contato + Quality Polish

**Goal**: O formulário de contato está funcional (monta mensagem e abre WhatsApp/mailto), a página é totalmente responsiva, Lighthouse Performance ≥ 90 com LCP < 2.5s, acessibilidade básica atendida e o build de produção gera artefatos limpos.
**Mode:** mvp
**Depends on**: Phase 3
**Requirements**: CON-01, CON-02, CON-03, CON-04, QLT-01, QLT-02, QLT-03, QLT-04
**Success Criteria** (what must be TRUE):

  1. O formulário exibe todos os campos da copy v4 (nome, e-mail, telefone, país, área, perfil com optgroups, jurisdições, mensagem), valida campos obrigatórios e formato de e-mail com feedback visual, inclui honeypot e checkbox LGPD
  2. Ao submeter, a mensagem é montada com os campos preenchidos e abre `wa.me` e/ou `mailto:advisory@mutualcapital.com.br` — sem backend
  3. Os 3 canais de contato (WhatsApp, advisory@, compliance@) + bloco "Respondemos em até 24h" estão visíveis e clicáveis
  4. Todos os grids colapsam corretamente em desktop, tablet e mobile (375px, 768px, 1280px); nenhum overflow horizontal
  5. Lighthouse Performance ≥ 90, LCP < 2.5s, CLS < 0.1; `vite build` conclui sem erros; contraste AA no tema dark; navegação por teclado funcional; aria-labels em ícones/emojis decorativos e inputs associados a labels

**Plans**: TBD
**UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation + Shell + Hero | 3/3 | Complete    | 2026-06-16 |
| 2. Seções Superiores | 0/3 | Not started | - |
| 3. Seções Inferiores e Blocos Pesados | 0/TBD | Not started | - |
| 4. Contato + Quality Polish | 0/TBD | Not started | - |
