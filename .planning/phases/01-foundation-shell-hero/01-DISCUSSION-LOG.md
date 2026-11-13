# Phase 1: Foundation + Shell + Hero - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-16
**Phase:** 1-Foundation + Shell + Hero
**Areas discussed:** Comportamento da navbar, Authority bar, Tratamento visual do hero, Visual do hero (coluna), Toggle PT|EN, Logo/favicon

---

## Comportamento da navbar (scroll)

| Option | Description | Selected |
|--------|-------------|----------|
| Pill frosted-glass (padrão do grupo) | Larga/transparente no topo; vira pílula central com blur+borda após ~80px | ✓ |
| Navbar fixa simples | Só ganha fundo sólido/sombra ao rolar, sem virar pílula | |

**User's choice:** Pill frosted-glass (padrão do grupo)
**Notes:** Consistência com lp-otc-mutual/capital.

---

## Authority bar (ao rolar)

| Option | Description | Selected |
|--------|-------------|----------|
| Some ao rolar | Aparece no topo, desaparece junto com a transição da navbar para pill | ✓ |
| Sempre visível (sticky) | Fixa no topo acima da navbar o tempo todo | |

**User's choice:** Some ao rolar
**Notes:** Libera espaço vertical, foco no conteúdo.

---

## Tratamento visual do hero (altura/watermark)

| Option | Description | Selected |
|--------|-------------|----------|
| Tela cheia + watermark "M" (fiel à v4) | ~92vh com letra "M" gigante semitransparente + faixa dourada | |
| Altura natural, sem watermark | Tamanho do conteúdo, só gradiente/blobs de fundo | ✓ |

**User's choice:** Altura natural, sem watermark
**Notes:** Mais limpo e rápido.

---

## Visual do hero (coluna)

| Option | Description | Selected |
|--------|-------------|----------|
| Hero centrado, sem imagem | Coluna única centrada sobre gradiente/blobs; estética editorial private bank | ✓ |
| Hero 2 colunas com elemento gráfico | Texto + arte abstrata à direita (globo/mosaico) | |

**User's choice:** Hero centrado, sem imagem
**Notes:** Advisory não tem produto físico; evita criar arte e peso extra.

---

## Toggle PT|EN (idioma não funcional)

| Option | Description | Selected |
|--------|-------------|----------|
| Visível desabilitado + "em breve" | "PT | EN" com EN esmaecido + tooltip "Em breve" | ✓ |
| Remover o toggle por enquanto | Sem idioma até o EN existir | |

**User's choice:** Visível desabilitado + "em breve"
**Notes:** Sinaliza que virá sem parecer quebrado; mantém elemento de design da v4.

---

## Logo e favicon

| Option | Description | Selected |
|--------|-------------|----------|
| Logo textual + favicon das refs | "Mutual Advisory" em Montserrat (gold no "Advisory"); favicon do capital | ✓ |
| Preciso fornecer assets oficiais | Usuário envia SVG/favicon oficiais | |

**User's choice:** Logo textual + favicon das refs
**Notes:** Zero bloqueio; substituível por asset oficial depois.

---

## Claude's Discretion

- Estrutura de `index.js`, nomes de classes utilitárias, breakpoints, ordem de scripts — seguir padrão das refs Vite e CONVENTIONS.md.
- Timing/easing das animações GSAP, desde que sutil/rápido.
- Markup semântico e aria — boas práticas desde já (a11y formal é aceite da Fase 4).

## Deferred Ideas

- Tradução EN (v2 — I18N-01).
- Splash screen animado (v2 — ENH-01).
- Arte gráfica no hero (refino futuro, não bloqueia).
