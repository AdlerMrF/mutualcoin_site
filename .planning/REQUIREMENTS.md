# Requirements: Mutual Advisory — Landing Page

**Defined:** 2026-06-16
**Core Value:** Página one-page que carrega extremamente rápido, apresenta a copy institucional palavra-por-palavra com a sofisticação visual do padrão Mutual, e converte em conversas confidenciais via WhatsApp/e-mail.

## v1 Requirements

Requisitos da primeira release. Cada um mapeia para fases do roadmap.

### Foundation (scaffold + design system)

- [x] **FND-01**: Projeto Vite vanilla inicializado (index.html + index.js + Tailwind + PostCSS), espelhando o padrão de `lp-otc-mutual`
- [x] **FND-02**: Design system dark aplicado como CSS variables (#0C1220, #FCB71B, #111D35, #1B2A46, #EEF1F9, #8898C0) + fonte Montserrat com `font-display: swap`
- [x] **FND-03**: Lenis (smooth scroll) e GSAP + ScrollTrigger integrados via npm e inicializados em `index.js`
- [x] **FND-04**: Tailwind configurado com purge (content: index.html + index.js) e tokens do design system

### Shell (estruturas persistentes)

- [x] **SHL-01**: Authority bar no topo (Mutual Advisory · Membro do Grupo Mutual Capital · pilares · link mutualcapital.com.br)
- [x] **SHL-02**: Navbar com logo, 7 links de seção, toggle PT|EN (visível, inativo) e CTA "Iniciar Conversa"; vira pill frosted-glass após scroll
- [x] **SHL-03**: Navbar destaca a seção ativa conforme o scroll (scroll-spy)
- [x] **SHL-04**: Footer com 4 colunas (Soluções, Perfis, Legal e Grupo) + barra inferior + 4 parágrafos de disclaimer
- [x] **SHL-05**: Floating CTA "Iniciar Conversa" aparece após ~600px de scroll, fixo no canto inferior direito

### Sections (conteúdo da copy v4, palavra-por-palavra)

- [x] **SEC-01**: Hero com eyebrow, h1 (com ênfase), hero-sub, nota legal, 2 botões e 5 authority items
- [ ] **SEC-02**: Faixa de números (6 stats: +40, 6, 28, 16, NDA, 24h) com counters animados
- [ ] **SEC-03**: Manifesto (eyebrow + título + 6 linhas numeradas 01–06 + frase de fechamento)
- [ ] **SEC-04**: Positioning — split "O que fazemos" (8 itens ✓) / "O que não fazemos" (7 itens —)
- [ ] **SEC-05**: Solutions — selo de Parceria Estratégica + 6 cards numerados com selo 🤝
- [ ] **SEC-06**: Profiles — 6 cards (Essencial, Estruturado, Internacional, Institucional, Patrimonial Premium, Ativos Digitais) com badge, ideal, features e tech
- [ ] **SEC-07**: Jurisdictions — 12 cards (região, nome, classes, usos, nota) + bloco "rede além das 12"
- [ ] **SEC-08**: Global presence band — texto + 9 tags de região
- [ ] **SEC-09**: Technology — 4 tech cards + painel de integração com 16 módulos Mutual Capital
- [ ] **SEC-10**: Why Advisory — 6 cards (ícone + título + descrição)
- [ ] **SEC-11**: How it works — 4 steps numerados (sub + título + parágrafo)
- [ ] **SEC-12**: ICP — 8 perguntas provocativas + 28 cards em 7 categorias (com label de categoria) + CTA final
- [ ] **SEC-13**: Confidentiality — 3 itens (NDA, LGPD/GDPR, Vault)
- [ ] **SEC-14**: Regulatory clarity — texto em 2 colunas + 5 linhas de responsabilidade
- [ ] **SEC-15**: Toda copy reproduzida palavra-por-palavra do HTML v4, re-tematizada para dark (Georgia→Montserrat) sem quebrar ritmo vertical

### Contact

- [ ] **CON-01**: Form de contato com todos os campos da copy v4 (nome, e-mail, telefone, país, área, perfil com optgroups, jurisdições, mensagem)
- [ ] **CON-02**: Submit monta a mensagem com os campos e abre WhatsApp (wa.me) e/ou mailto (advisory@mutualcapital.com.br) — sem backend
- [ ] **CON-03**: Validação client-side (campos obrigatórios, formato de e-mail) com feedback de erro; honeypot anti-spam; checkbox de consentimento LGPD
- [ ] **CON-04**: 3 canais de contato (WhatsApp, advisory@, compliance@) + bloco "Respondemos em até 24h"

### Motion (GSAP)

- [ ] **MOT-01**: Reveal suave on-scroll das seções/cards via GSAP ScrollTrigger (batch), substituindo IntersectionObserver+CSS
- [ ] **MOT-02**: Counters animados (faixa de números) disparados ao entrar no viewport
- [x] **MOT-03**: Parallax/transform leve no hero; reveals discretos e rápidos (tom advisory conservador)
- [ ] **MOT-04**: Reveal lazy dos blocos pesados (28 ICP cards, 12 jurisdições) só ao se aproximar do viewport

### Quality (cross-cutting)

- [ ] **QLT-01**: Responsivo em desktop, tablet e mobile (grids colapsam conforme breakpoints do padrão)
- [ ] **QLT-02**: Carregamento extremamente rápido — Lighthouse alto, LCP < 2.5s, CLS < 0.1
- [ ] **QLT-03**: Acessibilidade básica — contraste AA no tema dark, navegação por teclado, aria-label em ícones/emojis decorativos, labels associados aos inputs
- [ ] **QLT-04**: Build de produção (`vite build`) gera artefatos otimizados sem erros

## v2 Requirements

Adiado para release futura.

### Internationalization

- **I18N-01**: Tradução EN funcional (toggle PT|EN ativo)

### Enhancements

- **ENH-01**: Splash screen animado (stroke→fill→fly), opcional
- **ENH-02**: Integração do form com CRM/endpoint Mutual (lead capture)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Tradução EN no lançamento | Exigiria traduzir 1971 linhas / 28 ICPs / 12 jurisdições; toggle fica inativo |
| Backend / API / banco próprios | LP estática; form usa WhatsApp + mailto |
| CMS / conteúdo dinâmico | Copy fixa no HTML, sem necessidade de gestão de conteúdo |
| Reescrita/edição da copy | Material institucional aprovado — palavra-por-palavra |
| Identidade light/serif do v4 | Substituída por dark navy do grupo para consistência |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| FND-01 | Phase 1 | Complete |
| FND-02 | Phase 1 | Complete |
| FND-03 | Phase 1 | Complete |
| FND-04 | Phase 1 | Complete |
| SHL-01 | Phase 1 | Complete |
| SHL-02 | Phase 1 | Complete |
| SHL-03 | Phase 1 | Complete |
| SHL-04 | Phase 1 | Complete |
| SHL-05 | Phase 1 | Complete |
| SEC-01 | Phase 1 | Complete |
| MOT-03 | Phase 1 | Complete |
| SEC-02 | Phase 2 | Pending |
| SEC-03 | Phase 2 | Pending |
| SEC-04 | Phase 2 | Pending |
| SEC-05 | Phase 2 | Pending |
| SEC-06 | Phase 2 | Pending |
| SEC-07 | Phase 2 | Pending |
| SEC-08 | Phase 2 | Pending |
| MOT-01 | Phase 2 | Pending |
| MOT-02 | Phase 2 | Pending |
| SEC-09 | Phase 3 | Pending |
| SEC-10 | Phase 3 | Pending |
| SEC-11 | Phase 3 | Pending |
| SEC-12 | Phase 3 | Pending |
| SEC-13 | Phase 3 | Pending |
| SEC-14 | Phase 3 | Pending |
| SEC-15 | Phase 3 | Pending |
| MOT-04 | Phase 3 | Pending |
| CON-01 | Phase 4 | Pending |
| CON-02 | Phase 4 | Pending |
| CON-03 | Phase 4 | Pending |
| CON-04 | Phase 4 | Pending |
| QLT-01 | Phase 4 | Pending |
| QLT-02 | Phase 4 | Pending |
| QLT-03 | Phase 4 | Pending |
| QLT-04 | Phase 4 | Pending |

**Coverage:**

- v1 requirements: 35 total
- Mapped to phases: 35
- Unmapped: 0 ✓

---
*Requirements defined: 2026-06-16*
*Last updated: 2026-06-16 after roadmap creation — traceability complete*
