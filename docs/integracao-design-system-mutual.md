# Integração do design system Mutual e Site A

Destino: LP local da Mutucoin em `/lp-app/`, versão “depois”. Responsável: Codex. Nenhuma publicação realizada. A pasta de trabalho está sem metadados Git; não foi possível confirmar ramo ou remoto.

## Fontes consultadas

- `C:/Users/vivig/OneDrive/Desktop/Adler/front/referencias/design-system/DESIGN.md`, `tokens.json` e `mutual.css`.
- `Adler/front/projetos/site-a-mutual/MUTUAL-DESIGN.json`: identifica o Site A como variante `.org`.
- `Adler/front/projetos/site-a-mutual/depois/src/assets/css/identity.css`, `mutual-company.css`, `styles.css` e `themes.css`.
- Site A atual conferido no navegador a partir da distribuição local, em tema escuro, com 1440 × 960 px.

As referências em Adler foram somente lidas. A LP continua independente dessa pasta em execução.

## Aplicação

`src/lp-app/mutual-tokens.css` é uma cópia integral do adaptador canônico, com SHA-256 `f00d41dfaceed2b861fc9fb76b5a1212b2e03b00bdaf9865923344b17057c8b3`, igual ao arquivo de origem. As fontes Montserrat Latin e Latin Extended são cópias locais dos binários usados pelo Site A, sem recompressão.

`src/lp-app/mutual-identity.css` adapta esses tokens aos componentes da LP, somente sob `data-lp-polish`. O modo “antes” mantém sua tipografia e composição anteriores. A identidade `.org` é selecionada pelo script externo `public/lp-app/gate.js` antes da primeira pintura.

- Tipografia Montserrat, corpo com entrelinha 1,7, títulos com peso 500 e destaques 600.
- H1 36/44/52 px; H2 24/30/38 px, conforme as faixas do Site A.
- Grade de 1.200 px, com margens internas de 16/32/40/64 px nas faixas originais.
- Dourado `#FCB71B`, hover `#e5a618`, superfícies navy, fundo `#030b1e`, cartões `#111D35` e rodapé `#080e1a`.
- Botões com raio de 10 px, acabamento dourado e setas em caixas de 9 px; superfícies e cartões com raio de 16 px.

A estrutura da LP, suas artes transparentes, o diagrama de registro e os ícones com rolagem independente foram preservados. Não foram importados formulários, autenticação, dados, widgets financeiros, chamadas a APIs ou o runtime do Site A. Não há dependência de execução em Adler ou em serviços legados.

## Verificação e limites

Compilação local concluída. A LP foi conferida em 360, 390, 768, 1024, 1280 e 1440 px, sem transbordamento da página, navegação ou marca do rodapé. Menu, foco contido por teclado, Escape, perguntas frequentes e carregamento de todas as artes foram verificados. Movimento reduzido resultou em zero animações em execução. A versão “antes” preserva Inter e não recebe o atributo da identidade Mutual.

O adaptador e as duas fontes têm hashes de origem e cópia iguais, registrados em [mutual-design-provenance.json](mutual-design-provenance.json). Capturas da integração: [computador](../artifacts/mutual-site-a-integrado-desktop.png) e [celular](../artifacts/mutual-site-a-integrado-mobile.png).

O compilador confirma a integração dos arquivos, não equivalência visual com o Site A. Esta é uma aplicação da identidade Mutual à composição da LP, sem alegação de réplica integral.

O detector Impeccable apontou Montserrat como fonte frequente. Ela foi mantida deliberadamente por ser a tipografia canônica da marca expressamente solicitada pelo usuário; não é um defeito de implementação.
