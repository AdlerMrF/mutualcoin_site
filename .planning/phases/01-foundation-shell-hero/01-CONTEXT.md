# Phase 1: Foundation + Shell + Hero - Context

**Gathered:** 2026-06-16
**Status:** Ready for planning

<domain>
## Phase Boundary

Estabelecer a fundação técnica do projeto Vite vanilla e entregar a página abrindo no navegador com identidade dark navy, scroll suave (Lenis), motion (GSAP/ScrollTrigger) inicializado, as estruturas persistentes do shell (authority bar, navbar, footer, floating CTA) e o hero renderizando.

Cobre: FND-01..04, SHL-01..05, SEC-01, MOT-03.

NÃO cobre (outras fases): qualquer seção de conteúdo além do hero (stats, manifesto, solutions, etc. → Fase 2/3), o form de contato (Fase 4), polish de performance/a11y final (Fase 4). Discussão aqui é só sobre COMO implementar o que já está no escopo da fase.
</domain>

<decisions>
## Implementation Decisions

### Navbar
- **D-01:** Navbar usa o padrão **pill frosted-glass do grupo** (igual `lp-otc-mutual`/`lp-mutual-capital`): no topo é larga/transparente; após ~80px de scroll colapsa para uma pílula central com fundo blur + borda. Transição ~380ms cubic-bezier, via GSAP/JS.
- **D-02:** Os 7 links de seção aparecem no desktop; no mobile a navbar vira menu hambúrguer (mesmo padrão das refs).
- **D-03:** Toggle de idioma **PT | EN visível mas com EN desabilitado** (esmaecido) + tooltip "Em breve". O elemento existe (fiel à copy v4) mas não troca idioma no lançamento.
- **D-04:** CTA "Iniciar Conversa" na navbar âncora para `#contact`.

### Authority bar
- **D-05:** A authority-bar (faixa fina topo: "Mutual Advisory · Membro do Grupo Mutual Capital · ... · mutualcapital.com.br →") aparece no topo e **some ao rolar** (junto com a transição da navbar para pill), liberando espaço vertical.

### Hero
- **D-06:** Hero de **altura natural** (não 92vh tela cheia), **sem watermark gigante "M"**. Mantém apenas o gradiente/blobs dourados de fundo do padrão do grupo.
- **D-07:** Hero **centrado em coluna única** (sem coluna de imagem/produto — a Advisory não tem produto físico): eyebrow + h1 (com ênfase gold no trecho em `<em>`) + hero-sub + nota legal + 2 botões + 5 authority items, em estética editorial "private bank".
- **D-08:** **MOT-03** = parallax/transform leve e discreto no hero (ex: fade+rise dos elementos na entrada e leve deslocamento dos blobs no scroll), tom conservador, rápido. Sem efeitos chamativos.

### Branding / Assets
- **D-09:** Logo **textual**: "Mutual Advisory" estilizado em Montserrat com "Advisory" em gold (`#FCB71B`/gold3) — sem depender de SVG externo. Replica o padrão `.logo-main em` da copy v4.
- **D-10:** Favicon **reaproveitado das refs** (`favicon.ico` de `lp-mutual-capital`) — copiar para a pasta do projeto. Substituir por asset oficial Advisory se/quando fornecido.

### Claude's Discretion
- Estrutura exata de `index.js` (módulos de init), nomes de classes utilitárias, breakpoints precisos, ordem de carregamento de scripts — seguir o padrão das refs Vite e o design system de `CONVENTIONS.md`.
- Valores exatos de timing/easing das animações GSAP, desde que "sutil e rápido".
- Markup semântico (header/nav/main/footer, aria) — aplicar boas práticas; a11y formal é critério de aceite da Fase 4 mas deve já nascer correta.
</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Projeto / escopo
- `.planning/PROJECT.md` — visão, decisões-chave, constraints
- `.planning/REQUIREMENTS.md` — requisitos FND/SHL/SEC-01/MOT-03 desta fase
- `.planning/ROADMAP.md` §Phase 1 — goal e success criteria

### Mapa do codebase (gerado pelo GSD)
- `.planning/codebase/CONVENTIONS.md` — **design system dark consolidado** (paleta, tipografia Montserrat, cards, botões, badges, navbar pill, gradientes). Fonte primária de tokens.
- `.planning/codebase/ARCHITECTURE.md` — fluxo de init (DOMContentLoaded → Lenis → GSAP → observers) e **plano de migração de motion IntersectionObserver→GSAP/ScrollTrigger**
- `.planning/codebase/STACK.md` — stack-alvo Vite vanilla + package.json sugerido (vite, tailwind, postcss, autoprefixer, lenis, gsap)
- `.planning/codebase/STRUCTURE.md` — layout de diretórios a replicar (index.html, index.js, src/assets/css/styles.css, src/assets/img/)
- `.planning/codebase/CONCERNS.md` §Part A — mapa Seção→Padrão (linha do hero, authority-bar, navbar, footer, floating CTA)

### Copy-fonte (palavra-por-palavra)
- `../mutual advisory site v4.html` (raiz de `landing-pages/`) — copy exata. Para a Fase 1: authority-bar (linhas ~531-540), nav (~542-561), hero (~563-615), footer (~1863-1919), floating CTA (~1921-1937).

### Referências de implementação (LPs do grupo)
- `../lp-otc-mutual/index.html` + `index.js` — navbar pill-on-scroll, footer, floating, init Lenis. **Base técnica principal.**
- `../lp-otc-mutual/src/assets/css/styles.css` — CSS vars dark, scrollbar, keyframes
- `../lp-mutual-capital/index.js` + `tailwind.config.js` + `favicon.ico` — counters, shine-text, favicon a reaproveitar

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **Navbar pill JS** (`lp-otc-mutual/index.js`): lógica de scroll>80px que ajusta maxWidth/borderRadius/background/blur da navbar — portar e trocar o gatilho de RAF/scroll por GSAP/ScrollTrigger conforme plano de migração.
- **CSS vars dark** (`lp-otc-mutual/src/assets/css/styles.css`): `--dark-bg #0C1220`, `--hero-bg #0E162E`, `--card-bg #111D35`, `--border #1B2A46`, `--text-heading #EEF1F9`, `--text-muted #8898C0`, `--primary-color #FCB71B`, `--primary-hover #e5a618` — base do `:root`.
- **Lenis init + anchor smooth scroll** (`lp-otc-mutual/index.js`): instância Lenis (lerp 0.1, smoothWheel) + RAF loop + scroll suave em `a[href^="#"]` com offset da navbar — reaproveitar direto.
- **Floating CTA** (copy v4 + padrão das refs): bloco fixed bottom-right que aparece após scroll 600px — markup pronto na v4 (linhas 1921-1937), trocar o listener de scroll por ScrollTrigger.
- **Footer** (`lp-mutual-otc/Footer` + copy v4): grid 4 colunas + disclaimer — copy exata da v4.
- **favicon.ico** (`lp-mutual-capital/favicon.ico`): copiar para o projeto.

### Established Patterns
- **HTML monolítico + index.js**: padrão Vite vanilla das refs — uma página, um JS de inicialização, CSS via Tailwind + styles.css com vars. Replicar.
- **Tailwind inline + tokens**: escalas responsivas tipo `text-[34px] sm:... lg:...`, `py-20 sm:py-24 lg:py-32`, `rounded-[10px]` botões, shadow gold `shadow-[0_4px_14px_rgba(252,183,27,0.3)]` — ver `CONVENTIONS.md`.
- **Montserrat** via Google Fonts com `font-display: swap` + preconnect (requisito de performance).
- **Migração de motion**: refs usam IntersectionObserver+RAF+CSS keyframes; esta LP usa **GSAP + ScrollTrigger** — ver `ARCHITECTURE.md` para o mapeamento por tipo de animação (reveal, navbar transform, parallax hero).

### Integration Points
- Esta fase cria o `index.html` (shell + hero + placeholders/âncoras das seções futuras), o `index.js` (init Lenis/GSAP/navbar/floating), `src/assets/css/styles.css` (vars + base), `tailwind.config.js`, `postcss.config.js`, `vite.config.js`, `package.json`. As Fases 2-4 preenchem as seções dentro do `<main>` já estruturado.
</code_context>

<specifics>
## Specific Ideas

- Estética-alvo do hero: "private bank / advisory patrimonial" — sóbrio, editorial, gold sobre dark navy. A copy é séria/densa; o visual deve respirar (espaçamento generoso) sem efeitos chamativos.
- Consistência visual com as LPs irmãs do grupo é objetivo explícito (mesma paleta, mesma navbar pill, mesmo footer-style).
</specifics>

<deferred>
## Deferred Ideas

- **Tradução EN** — toggle fica inativo; tradução é v2 (I18N-01). Não implementar agora.
- **Splash screen animado** — opcional/v2 (ENH-01). Não nesta fase.
- **Imagem/arte gráfica no hero** — descartado para o hero centrado; se quiser uma arte abstrata depois, seria refino futuro, não bloqueia a fase.

</deferred>

---

*Phase: 1-Foundation + Shell + Hero*
*Context gathered: 2026-06-16*
