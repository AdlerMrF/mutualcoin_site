# Walking Skeleton — Mutual Advisory Landing Page

**Phase:** 1
**Generated:** 2026-06-16

## Capability Proven End-to-End

A pagina abre em `localhost:5173` com o stack inteiro funcionando: Vite serve o `index.html`, o Tailwind/PostCSS processa as classes, o design system dark navy (#0C1220 + Montserrat) renderiza, e o Lenis + GSAP/ScrollTrigger estao ativos (scroll com inercia suave, console sem erros). Esta e a fatia mais fina que prova scaffold + build + design system + motion engine de ponta a ponta — sobre a qual o shell (Plano 02), o hero (Plano 03) e as Fases 2-4 sao construidos sem renegociar a arquitetura.

> O Walking Skeleton e o Plano `01-01`. Os Planos `01-02` (shell) e `01-03` (hero) ja sao as primeiras fatias verticais empilhadas sobre ele.

## Architectural Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Build tool / framework | Vite 7.3.1 vanilla (sem React/Next) | LP estatica que precisa carregar extremamente rapido; espelha `lp-otc-mutual`/`lp-mutual-capital` do grupo; HMR instantaneo, bundle minimo |
| Estilo | Tailwind 3.4.19 (utility-first) + CSS variables em `styles.css` | Bundle pequeno via purge; tokens do design system como CSS vars (`:root`); consistencia com as LPs irmas |
| CSS pipeline | PostCSS 8.5.6 + Autoprefixer 10.4.23 | Pipeline padrao do grupo (`tailwindcss` → `autoprefixer`) |
| Smooth scroll | Lenis 1.3.21 (`{ lerp: 0.1, smoothWheel: true, duration: 1.2 }`) | Scroll lerp-based do padrao do grupo; toda navegacao por ancora via `lenis.scrollTo()` (NUNCA `scroll-behavior: smooth` no CSS) |
| Motion engine | GSAP 3.14.2 + ScrollTrigger (npm, NAO CDN) | Substitui IntersectionObserver+RAF+CSS keyframes das refs; importado como modulo para usar `ScrollTrigger`; co-op com Lenis via `gsap.ticker` + `ScrollTrigger.scrollerProxy` |
| Identidade visual | Dark navy do grupo (#0C1220 bg, #FCB71B gold, Montserrat) | Consistencia com o Grupo Mutual Capital; substitui a identidade light/serif do v4 |
| Idioma | PT apenas; toggle PT|EN visivel mas inativo (EN esmaecido) | I18N-01 adiado para v2; toggle existe fiel a copy v4 |
| Form / backend | Nenhum backend; contato via WhatsApp + mailto (Fase 4) | LP 100% client-side; hospedagem estatica |
| Directory layout | `index.html` + `index.js` na raiz; `src/assets/css/styles.css`, `src/assets/img/` | HTML monolitico + um JS de init; padrao Vite vanilla do grupo |
| Icones | Font Awesome 6.4.0 via CDN cdnjs | Padrao do grupo; sem SRI para manter paridade com LPs irmas |

## Stack Touched in Phase 1

- [x] Project scaffold (Vite + Tailwind + PostCSS + Autoprefixer; scripts dev/build/preview) — Plano 01
- [x] Routing — one-page com sections ancoraveis (#hero ... #contact); navegacao via Lenis.scrollTo — Planos 01/02
- [x] "Data layer" (N/A — LP estatica): em vez de DB, a fonte de verdade e a copy v4 renderizada estaticamente; um real "read" = render do design system tokens; um real "write" de estado = transicao da navbar pill / scroll-spy no scroll
- [x] UI interativa wired ao motion engine — navbar pill on scroll, scroll-spy, floating CTA, mobile menu, hero entrance + parallax (Planos 02/03)
- [x] Run command que exercita o stack inteiro — `npm run dev` serve em localhost:5173 (verificado em checkpoint humano)

## Out of Scope (Deferred to Later Slices)

- Qualquer secao de conteudo alem do hero — stats, manifesto, positioning, solutions, profiles, jurisdictions, global presence (Fase 2); technology, why advisory, how it works, ICP, confidentiality, regulatory clarity (Fase 3)
- Formulario de contato (WhatsApp + mailto), validacao, honeypot, canais de contato (Fase 4)
- Polish final de performance/a11y: Lighthouse ≥90, LCP <2.5s, CLS <0.1, contraste AA auditado, build de producao otimizado (Fase 4)
- Tradução EN funcional (I18N-01, v2); splash screen animado (ENH-01, v2); integracao do form com CRM (ENH-02, v2)
- Asset oficial de favicon Advisory — usa o `favicon.ico` reaproveitado de `lp-mutual-capital` ate fornecimento (D-10)
- SRI nos recursos de CDN — decisao de paridade com o grupo

## Subsequent Slice Plan

Cada fase posterior adiciona fatias verticais sobre este esqueleto sem alterar as decisoes arquiteturais acima:

- **Fase 1 (esta):** Plano 01 esqueleto bootavel → Plano 02 shell (authority bar, navbar pill, scroll-spy, footer, floating CTA) → Plano 03 hero + motion
- **Fase 2:** 7 secoes superiores (stats counters, manifesto, positioning, solutions, profiles, jurisdictions, global presence) com reveals GSAP ScrollTrigger
- **Fase 3:** 6 secoes inferiores e blocos pesados (technology, why advisory, how it works, ICP 28 cards lazy reveal, confidentiality, regulatory clarity)
- **Fase 4:** Form de contato funcional (WhatsApp + mailto) + responsividade + Lighthouse ≥90 + a11y + build de producao
