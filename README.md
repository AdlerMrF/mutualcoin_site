# Mutucoin · Site B

> **Destino oficial atual:** código no repositório privado [Mutual-Capital/mutucoin-site](https://github.com/Mutual-Capital/mutucoin-site) e publicação exclusivamente na conta Cloudflare **Mutual | Global**, projeto **mutucoin-institucional**, em **mutucoin.xyz**. MutualGit permanece somente como referência histórica; Google Cloud não é destino de operação ou publicação deste projeto. Seguir [AGENTS.md](AGENTS.md) e o [procedimento de publicação e isolamento](docs/publicacao-e-isolamento.md). O restante deste documento preserva o histórico das passadas de construção, com seus limites e verificações datados.

Apresentação institucional de Mutucoin/MTC/MutualChain, adaptada sobre o Site A aprovado (`6b3b0df`). Foram mantidos a identidade navy/amarelo, a Montserrat, o cabeçalho, os cartões, as três animações, os controles de pausa, o tratamento de movimento reduzido, os sete idiomas e a proteção da base.

## Páginas

| Página | Caminho em português |
|---|---|
| Início | `/` |
| Mutual On-Chain | `/relatorios-on-chain/` |
| Mutual Carteiras | `/comprovacao-de-carteiras/` |
| MutualChain | `/global-blockchain/` |
| Mutual VASP | `/vasp/` |
| Mutual Hub | `/trading/` |
| Ecossistema | `/ecossistema/` |
| Estado | `/estado/` |
| Cotação | `/cotacao/` |
| Contato | `/contato/` |
| Empresas e Governo | `/infraestrutura-empresarial/` |

Cada página possui versões em português, inglês, espanhol, alemão, italiano, japonês e árabe. As demais versões usam os prefixos `/en/`, `/es/`, `/de/`, `/it/`, `/ja/` e `/ar/`. O árabe usa leitura da direita para a esquerda. A troca de idioma preserva a página atual.

A página empresarial reúne aplicações para governo, finanças, saúde, comércio exterior e infraestrutura crítica. As opções de proteção e a demonstração Mutucoin são institucionais: usam somente dados sintéticos, não enviam conteúdo para serviços externos e não habilitam operações. Países, moedas, corredores e controles são confirmados antes de qualquer contratação. A decisão está registrada em [ADR 0001](docs/adr/0001-demonstracao-empresarial-segura.md).

A home segue a ordem do brief: hero em ato, faixa B2B sem contador, ecossistema com 14 nós, missão/estratégia/equipe, contato e documentos pendentes. Os corredores permanecem na página do ecossistema; o globo está na home e na página da MutualChain.

## Geração e conferência, sem servidor

```sh
npx vite build
npm run check
npm run check:browser
```

A última conferência é preparada para interceptar os arquivos diretamente no navegador, sem abrir porta de servidor. Nesta execução, a abertura do navegador foi impedida por permissão do ambiente. O relatório está em `artifacts/validacao-navegador.json`; a revisão visual e os testes reais de interação continuam pendentes.

Todas as 70 páginas geradas têm `noindex`, descrição, endereço canônico, alternativas `hreflang`, informações de compartilhamento e dados estruturados. O bloqueio também está em `robots.txt` e `X-Robots-Tag`. A opção de gerar uma versão indexável foi bloqueada para este Site B. A origem `https://mutucoin.local.invalid` identifica apenas os arquivos locais; o domínio de publicação não foi presumido.

`config/routes.js` define as páginas. `config/pages.js` compõe o conteúdo sobre os componentes reaproveitados. `config/header.html` e `config/visuals.js` guardam o cabeçalho e as molduras da base. `config/site.js` adapta idioma, metadados e proteção por página. Os textos ficam em `src/i18n/*.json`.

Fontes, decisões de conteúdo e pendências estão em [FONTES.md](FONTES.md). Nenhum dado do produto é consultado ou alterado. Somente a página de cotação pode carregar os widgets gratuitos externos do TradingView, com atribuição, sem fornecer uma cotação MTC. No teste local, o conteúdo externo é simulado apenas para conferir os controles; isso não valida disponibilidade do serviço nem preços.

Não houve publicação, servidor ou commit. Referências, espelho e PDF permaneceram intactos.

## Passada 2

A identidade legal foi incluída no rodapé, no contato e nos dados estruturados das 70 páginas. A página de contato contém o posicionamento oficial e os três pilares, com o português preservado integralmente e traduções nos outros seis idiomas. Carteiras e Mutual Hub descrevem tecnologia, controle de chaves pelo usuário e execução de operações financeiras por parceiros licenciados.

As molduras agora carregam os três MP4 originais. Cada vídeo tem cartaz, reprodução silenciosa em repetição, controle interno e legenda abaixo. A reprodução acompanha a entrada e saída da tela, preserva a pausa manual e começa pausada quando há preferência por movimento reduzido. A permissão de reprodução automática está limitada ao próprio site.

`npx vite build` e `npm run check` passaram. O texto oficial em português foi comparado integralmente ao documento do dono. A lógica dos controles foi conferida separadamente. A revisão de navegador foi ampliada para onze larguras entre 360 e 1440 pixels e para verificar o avanço real dos três vídeos, mas continua impedida pela permissão do ambiente para abrir o navegador. A tentativa de iniciar a prévia local também foi bloqueada. Portanto, reprodução real e ausência de sobreposição permanecem sem confirmação visual nesta execução.

## Passada 3

A limpeza segue `../site-limpeza-brief.md`. O espaço padrão entre seções passou de 84 para 112 px nas telas maiores e de 56 para 64 px no celular. A largura foi unificada, os textos principais passaram a 16 px e a leitura foi limitada a 68 caracteres de referência. Cartões, avisos e etiquetas perderam gradientes, brilhos, ícones repetidos e bordas desnecessárias. O amarelo fica na ação principal e no nome Mutucoin; o foco de teclado continua destacado.

As 14 conexões permanecem em dois grupos expansíveis, com os meios de pagamento abertos inicialmente. Os textos completos continuam no HTML e os grupos usam os controles nativos do navegador, acessíveis por teclado. O aviso legal ganhou linhas mais confortáveis. As animações decorativas foram suspensas nesta apresentação, e apenas um vídeo pode tocar por vez, preservando os três arquivos originais, as legendas, a pausa manual e a preferência por movimento reduzido.

`npx vite build` e `npm run check` passaram. A comparação com a versão anterior confirmou 5.831 ocorrências de texto preservadas nas 70 páginas e as mesmas referências aos vídeos. A paleta foi conferida por cálculo de contraste; a lógica dos controles foi exercitada em Node. O relatório está em `artifacts/validacao-limpeza.json`.

A revisão de navegador agora mede blocos vizinhos com `getBoundingClientRect`, verifica os grupos abertos e o teclado, em 14 larguras entre 360 e 1440 px. A execução continua impedida pelo ambiente antes de abrir a primeira página: ausência de sobreposição, acessibilidade completa e reprodução real continuam pendentes. O impedimento está em `artifacts/validacao-navegador.json`. Não houve publicação nem commit.

## Passada 4

A página Blockchain ganhou a seção “Para que serve a MutualChain”, com os cinco blocos do brief em linguagem simples nos sete idiomas. A leitura é contínua, com um título principal da seção, subtítulos e espaço entre os assuntos. A home tem uma chamada curta que leva diretamente à explicação no mesmo idioma. A seção apresenta o Mutual Cartório como proposta em implantação, com provas por lote e documentos fora da rede, e termina com “Fale com a Mutual”, levando ao contato no idioma escolhido.

`npx vite build` e `npm run check` passaram para as 70 páginas. A busca pelos termos restritos encontrou apenas o aviso legal. A conferência de navegador foi ampliada para os novos blocos, mas a abertura continua bloqueada pelo ambiente; a ausência de sobreposição ainda não foi confirmada visualmente. Não houve publicação nem commit.

## Governança e conformidade

A página `/governanca-e-conformidade/` segue as mesmas rotas por idioma, metadados, proteções e bloqueio de indexação das demais páginas. Tem links no menu e no rodapé, além de uma chamada “Documentos” na home. O conteúdo anterior, inclusive a seção de documentos pendentes, foi preservado.

`config/governance.js` é a lista única dos documentos: identificador, nome nos sete idiomas, versão, estado e arquivo. Os nove itens estão em elaboração, com arquivo nulo, selo visível e botão “Baixar” desabilitado. Cada item associa o nome, o estado e a explicação aos recursos de leitura assistida. Nenhum PDF foi acrescentado.

Para disponibilizar um documento futuramente, é necessário definir `estado: 'publicado'` e um caminho local como `arquivo: '/documentos/nome.pdf'`, com o PDF existente dentro de `public/`. A geração da página e os checks recusam publicação sem arquivo, caminhos externos e arquivos fora dessa pasta. Um item em elaboração nunca gera link, mesmo que receba um caminho de arquivo por engano. O link publicado abre em outra aba com a proteção `noopener` e o atributo de download.

`npm run check:i18n`, `npm run build` e `npm run check` passaram para as 77 páginas. O check de traduções também verifica os nomes dos documentos. `npm run check:governance` verifica os documentos gerados nos sete idiomas e simula publicação válida, PDF ausente, caminho inválido, arquivo fora da pasta, tradução vazia e download indevido. Os arquivos temporários desses testes ficam fora do projeto e são removidos ao final. A comparação das 70 páginas anteriores confirmou a preservação integral de seu conteúdo, admitindo apenas os novos links e a chamada da home.

`npm run check:browser` foi executado, mas o ambiente impediu a abertura do navegador. A revisão visual e a execução dos testes de acessibilidade no navegador permanecem pendentes. Não houve push nem publicação.

## Passada B5 — Serviços e painel

A página `/servicos/` e a chamada na home apresentam os módulos e os serviços complementares nos sete idiomas. As operações financeiras são descritas como realizadas via parceiro licenciado. Todas as áreas novas indicam implantação; não foram acrescentados preços, métricas comerciais ou promessas de rendimento.

O painel começa em `/app/`. Cada área tem endereço próprio, por exemplo `/app/cotacao/`, `/app/carteira-multi-rede/`, `/app/carteira/` e `/app/multi-rede/`, também com os prefixos dos idiomas. `config/plataforma.json` é a única lista das 34 áreas: identificador, nomes e descrições traduzidos, rota, módulo, aba e rotas de origem, item do mapa, referências de API, indicação de movimentação de valor e estado `em_implantacao`. A mesma lista gera menu, telas e conteúdo de Serviços. As abas Carteira e Multi-rede foram mantidas separadas, além da visão do módulo Carteira Multi-rede. Documentação, Checkout, API pública v1, white-label, administração, Webhooks, API Keys, auditoria, saúde e demais funções do mapa têm telas próprias.

As referências de API são apenas metadados: o painel não consulta nem envia dados. As telas não têm ações operacionais, formulários, geração de chaves ou armazenamento no navegador. Áreas que movem valor mostram “Operação desligada nesta versão”. O Faucet apresenta exclusivamente MutualChain Testnet, sem pedidos habilitados. A faixa comum de redes informa que o estado não foi consultado; não simula disponibilidade.

`npm run check:cobertura`, incluído em `npm run check`, lê o mapa original quando disponível e compara com `config/mapa-plataforma.json`, uma cópia reduzida do inventário. A cópia contém somente abas, rotas, nomes de módulos, funções adicionais e caminhos de API extraídos por `scripts/lib/mapa-plataforma.mjs`. Não copia exemplos de credenciais nem dados pessoais. As seis referências de URL contadas pelo mapa são `/`, `/docs`, `/docs.html`, `/api-reference.html`, `/guides.html` e `/llms.txt`; `/docs` e seu destino são preservados na mesma tela de documentação. Com as 15 abas, completam as 21 referências atuais.

O check exige tela e menu nos sete idiomas, preserva nomes de abas e módulos e exige telas separadas para os itens compostos do mapa. Também confere as referências de API, o aviso de operação desligada, a regra do parceiro e o Faucet exclusivo de testes. Exercita 1.764 combinações de troca de idioma e simula aba, módulo e função ausentes, classificação financeira alterada, Faucet indevido e ações habilitadas para provar a reprovação dessas falhas.

`npm run build` e `npm run check` passaram: 329 páginas, incluindo 238 telas de áreas. A comparação com a versão anterior confirmou as mesmas rotas e o conteúdo integral das 77 páginas anteriores, além dos 1.407 textos que já existiam; somente foram somados os novos links e a chamada de Serviços. O registro está em `artifacts/validacao-b5.json`. A tentativa de revisão no navegador foi impedida pelo ambiente antes de abrir a primeira página; aparência e interação real não foram confirmadas nesta passada. Sem push nem publicação.

O ambiente desta execução bloqueou a gravação do histórico Git na pasta original (`.git/index.lock`: `Operation not permitted`). As alterações permanecem na pasta de trabalho. O commit único será preparado em cópia temporária e exportado como arquivo local; sua aplicação à pasta original permanece pendente.

## Passada B6 — consultas públicas, sem operações

As 34 áreas e todos os textos da B5 foram preservados. Dashboard, Cotação, Explorer, Faucet, Cartório, Tokenizar e Contratos receberam consultas públicas nos sete idiomas; as operações continuam em implantação e desligadas. As observações das passadas anteriores acima descrevem aquelas versões.

`config/leitura-publica.json` define a origem HTTPS (padrão `https://api.mutucoin.net`), os oito caminhos exatos permitidos com seus parâmetros fixos, o tempo máximo de quatro segundos e o limite de 512 KiB por resposta. Para mudar a origem, altere `base` e gere o site novamente: o adaptador e a política `connect-src` usam a mesma configuração. A política permite somente essa origem, sem `'self'`, curingas ou outras conexões.

Toda consulta passa por `src/plataforma/leitura.js`. Apenas GET é aceito; outro método ou caminho falha antes de abrir conexão. Não são enviados cabeçalhos de autenticação, credenciais, cookies ou endereço de referência; redirecionamentos são recusados e respostas não são guardadas em cache. Não há geração de chaves nem armazenamento local. O limite de tempo cobre também o recebimento do corpo; o tamanho é conferido no cabeçalho, quando presente, e nos bytes efetivamente recebidos.

Números do JSON são transformados diretamente em texto antes da interpretação. Preços, quantidades e saldos são validados e formatados por texto, sem arredondamento ou valores substitutos. Cada resposta tem uma verificação própria de campos e tipos. Erro de rede, CORS, redirecionamento, forma inesperada ou limite produz “Indisponível no momento”, sem números e com o horário da tentativa. O horário de atualização do preço vem da plataforma e aparece separado da tentativa.

Só os campos necessários e previamente permitidos chegam às telas. `issuerName`, emissor, nomes, descrições, títulos, assinaturas e campos desconhecidos, inclusive aninhados, são descartados no adaptador. As listas de ativos e contratos mostram identificadores, endereços e dados técnicos públicos; não mostram nomes recebidos da API. Nenhum conteúdo da API é inserido como HTML.

O Faucet confirma a identidade da rede `mutucoin-testnet`, com identificador `28002`, antes de consultar o saldo; não existe leitura do Faucet principal na lista permitida. O botão de pedir tokens permanece desabilitado, independentemente do estado público informado pela plataforma.

O mapa não oferece verificação do Cartório por hash via GET. A leitura usa os últimos 50 registros públicos da rede principal, e a busca por hash ocorre somente nessa lista, no navegador, sem novo pedido. Um hash ausente não é apresentado como inexistente no Cartório. Em Contratos, a fonte é `GET /api/v1/artifacts`, pública segundo o mapa: artefatos públicos, e não a lista administrativa protegida de contratos gerados.

`npm run check:leitura`, incluído em `npm run check`, exercita a lista fechada, os métodos bloqueados, opções da conexão, base configurável, redirecionamento, erros, formatos, tempo limite inicial e durante a resposta, tamanho anunciado e recebido, precisão decimal, descarte de campos pessoais antes da tela e fluxo das telas com respostas sintéticas. O check de cobertura continua verificando as 238 telas e reprovando ações habilitadas nos módulos que movem valor.

Nesta passada, `npm run build` e `npm run check` passaram para 329 páginas. A comparação com o histórico confirmou os textos e metadados anteriores preservados. O ambiente impediu o acesso à API e a abertura do navegador; por isso o recebimento de dados reais, a compatibilidade dos formatos atuais, a liberação CORS e a aparência no navegador não foram confirmados nesta execução. As amostras dos testes são sintéticas, baseadas no mapa fornecido, e nunca são usadas pelo site. Sem push e sem publicação.

O registro do commit na pasta original foi impedido pelo ambiente: `.git/index.lock: Operation not permitted`. O histórico original permanece intacto; o commit único e seu arquivo de aplicação local foram preparados em cópia temporária, sem push.

## Passada de animações da home

Somente acréscimos ao conteúdo: “Como a rede se move” e “Negocie entre mercados”, nos sete idiomas. Os cartões levam a Cotação, Dashboard da MutualChain e Multi-rede no `/app` do mesmo idioma; operações continuam desligadas e via parceiro licenciado.

Os indicadores e o preço passam exclusivamente pelo adaptador B6 (`src/plataforma/leitura.js`). A lista pública aprovada oferece o total do registro de ativos e o preço MTC em USD. Não oferece volume negociado nem carteiras ativas: ambos permanecem “— / Em implantação”. “Pares / ativos” declara expressamente que conta ativos registrados, não pares negociáveis. A lista de ativos recebida nunca é contada para substituir seu total. O preço MTC não é tratado como cotação do par MTC/USDT. OHR é identificado somente como gás; as redes reutilizam o catálogo de referência, sem sugerir integração ativa. Nenhum preço é atribuído a elas.

As consultas começam apenas quando o bloco se aproxima da tela. A animação numérica só recebe um valor validado, preserva sua precisão e mantém o valor final disponível para leitores de tela. Falhas independentes preservam o outro dado. Zero só aparece quando foi retornado como dado real; ausência nunca vira zero. Não há consulta adicional para tentar deduzir os indicadores indisponíveis.

Títulos acendem ao rolar; cartões entram das laterais em sequência e recebem realce; as colunas seguem sentidos opostos e pausam fora da tela, em aba oculta, com o ponteiro sobre elas ou pelo botão. Movimento reduzido mostra o estado final e somente uma cópia de cada cartão. O título e a mídia principal do hero não recebem animação de entrada; somente o fundo decorativo reage à rolagem. Não foi acrescentada biblioteca.

`npm run check:home`, incluído em `npm run check`, verifica ausência, erros, falha parcial, zero real, caminhos permitidos, precisão e apresentação nos sete idiomas com dados sintéticos restritos aos testes. `npm run check:browser` inclui os novos blocos nas medições de largura e sobreposição, além de verificar ausência e estado sem movimento. A execução de navegador continua sujeita à disponibilidade do ambiente; aprovação dos testes de dados não comprova aparência, largura real, LCP medido ou disponibilidade da API ao vivo.

## Passada de blindagem — 28/10/2026

Esta seção registra o estado atual; as passadas acima são histórico. O conteúdo anterior permanece nas mesmas 329 páginas. Os avisos antigos sobre e-mail e entrada, superados pelos canais agora informados, foram preservados em “Informações da versão anterior”. Os três e-mails confirmados estão visíveis no contato e no rodapé.

A primeira visita usa tema claro independentemente do sistema. A preferência visual é a única gravação permitida: `mutucoin-theme`, com os valores `light` e `dark`, protegida contra armazenamento bloqueado. O script do tema é aplicado no início do `<head>` e autorizado na política de segurança por seu hash; não há `unsafe-inline`. Os seletores do cabeçalho, do celular e do rodapé preservam a página ao trocar idioma. Widgets ativos da TradingView acompanham o tema; a pausa e o carregamento voluntário com movimento reduzido são preservados.

O rodapé usa a mesma estrutura de cinco colunas, grade, espaços e aviso `footer.scope` do Site A. Os 34 destinos de módulos vêm da lista existente da plataforma, com o estado de implantação das respectivas telas. Termos e privacidade levam aos documentos em elaboração. A divulgação de risco tem seu item em elaboração na página de governança; os nove documentos existentes permanecem intactos. O mapa de navegação anterior também permanece no rodapé, em um grupo expansível.

A jornada começa com a proposta Mutucoin/MTC/MutualChain, segue por rede e mercados, aplicações da MutualChain, serviços e ecossistema, missão, motivos da escolha, perguntas e acesso web. O checklist ajuda a reconhecer necessidades e conduz ao contato. Documentos e rodapé fecham o percurso. Os acessos levam ao painel existente, à documentação em implantação e ao contato para cadastro; não existe alegação de cadastro operacional ou aplicativo publicado. Sem fonte válida, os números continuam “—”. A linha, o globo, o arco, o aparelho e o token são ilustrações conceituais; não são séries de dados de mercado.

| Site B: diferença anterior → ajuste | Resultado no código |
|---|---|
| Fonte já Montserrat → mesma família e pesos da referência | Fonte local preservada; títulos 500, cartões e marca 600 |
| Escala própria → escala mutualcapital-v2 | h1 36/44/52 px; h2 28/36/44 px; hero 17/19 px; corpo 15 px e legenda 12 px |
| Contêiner de 1248 px → padrão de 1200 px | Margens laterais de 20–64 px, conforme a largura |
| Espaços da base → ritmo compartilhado | Seções de 80–128 px, como o Site A; grade com intervalos de 24/32/64 px |
| Cabeçalho da base → padrão da referência | Logo 36 px; altura 88 → 64 px ao rolar; submenu Plataforma preservado; menu completo quando a linha não cabe |
| Rodapé em três grupos → cinco colunas do Site A | Institucional, Serviços, Suporte, Contato e Idioma; acordeões no celular; mesmo aviso legal |
| Apenas navy → claro inicial e escuro preservado | Navy #161D33 e amarelo #FCB71B; pares de texto e fundo próprios para cada tema |

O Site A e a referência foram somente lidos; não foram alterados.

### Verificações e limites

```sh
npm run build
npm run check
npm run check:browser
npm run check:lighthouse
npm audit
```

`check` mantém i18n, governança, cobertura e leituras e acrescenta as provas de reprovação. Os testes anteriores que impediam qualquer armazenamento agora admitem somente a chamada literal da preferência visual; os demais armazenamentos e ações financeiras seguem proibidos.

`check:browser` usa Playwright com Google Chrome e percorre TODAS as 329 páginas em 360/768/1024/1440 px × 7 idiomas × 2 temas: 2.632 combinações. Não há modo que transforme execução parcial em aprovação. Console, execução, política de segurança, links locais, traduções, marcadores crus, conteúdo cortado e axe devem passar. A preferência de movimento é `reduce`; a página inteira é rolada antes do axe no estado final. Apenas os descendentes dentro dos iframes TradingView são excluídos; o iframe, seu título, a atribuição e os controles próprios continuam incluídos. FAQ, rodapé aberto e cada aba também recebem axe. Os defeitos conhecidos são injetados nos testes das guardas para comprovar reprovação, sem dados reais.

Essa verificação usa arquivos locais interceptados, resposta sintética indisponível para a API e iframe externo vazio. Isso permite testar a ausência de dados, mas não comprova disponibilidade dos serviços externos. O comando antigo foi preservado como `check:browser:legacy`; o comando principal é a matriz nova.

`check:lighthouse` exige 100 em desempenho, boas práticas e acessibilidade em celular e computador, e deslocamento de layout igual a zero. O ambiente atual bloqueia o Chrome e a abertura da porta local: navegador, axe, comparação por prints, notas Lighthouse, CLS e LCP seguem SEM COMPROVAÇÃO. A consulta `npm audit` também foi bloqueada pela rede; não há declaração de ausência de vulnerabilidades. Esses impedimentos retornam erro, nunca sucesso. Os registros estão em `artifacts/validacao-blindagem-browser.json` e `artifacts/validacao-lighthouse.json`.

O site continua local e `noindex`, com robots e cabeçalhos bloqueando indexação. SEO só fecha 100% após publicação autorizada, com domínio real, disponibilidade e indexação verificadas. Não houve envio nem publicação.

A tentativa de preparar o commit único nesta passada foi recusada pelo ambiente: `.git/index.lock: Operation not permitted`. Nenhum commit foi criado, e o histórico permanece no ponto inicial. As alterações e evidências estão na pasta de trabalho; não foi criado repositório alternativo nem realizado envio ou publicação.

## Rodada portas e catálogo — seções 8 a 12, 28/10/2026

Esta rodada acrescenta quatro portas: `/para-voce/`, `/para-sua-empresa/`, `/seja-nosso-parceiro/` e `/nossa-estrutura/`. Todas têm apresentação, cartões e contato. O menu do cabeçalho v2 reúne os itens exigidos em painéis de duas colunas; no celular, os mesmos grupos funcionam como acordeão. Os botões informam o estado aberto, o teclado circula dentro do painel e Esc fecha e devolve o foco. O submenu Plataforma continua dentro de Nossa Estrutura. As portas também ligam as páginas e as seções anteriores da home.

A jornada começa pela infraestrutura, com o núcleo Mutual e seus seis módulos ilustrados; passa pelo horizonte, pela placa de módulos e pelo catálogo unido; apresenta as quatro portas e os seis casos de uso; mostra exemplos de operação e recursos; mantém toda a sequência anterior e termina no contato com especialista. As faixas e os aparelhos usam apenas desenhos próprios, sem valores de mercado, e declaram dados fictícios e ausência de operação real. Não entram depoimentos nem selos. As animações têm pausa, param fora da tela ou com a aba oculta e respeitam a preferência de reduzir movimento.

O catálogo soma Contas Globais, Guarda segregada, Liquidez, Pagamentos Globais, Exchange, Wealth, Produtos para instituições, On/Off-ramp, Tesouraria Global e API. Os destinos próprios ficam em `/servicos/<serviço>/`: apresentam o serviço, informam “Em breve” para o acesso integrado e oferecem contato e ligação à área existente da plataforma. Os 34 módulos originais permanecem em `/servicos/` e `/app/`, sem habilitar operações.

Os seis percursos têm página própria em `/casos-de-uso/`:

| Caminho | Caso |
|---|---|
| `importacao-exportacao/` | Importação e exportação |
| `logistica/` | Logística |
| `fintechs-psps/` | Fintechs e PSPs |
| `e-commerce-internacional/` | E-commerce internacional |
| `agro-commodities/` | Agro e commodities |
| `tesouraria-stablecoin/` | Tesouraria em stablecoin |

Cada percurso segue desafio, fluxo ilustrado com as mesmas trilhas da orquestração, recursos, público, segurança e contato. Os trilhos Pix/BRL, SPEI/MXN, CVU/ARS, Bre-B/Nequi/COP, Yape/CCI/PEN, USD, EUR, CNH e as redes TRON, Ethereum, Solana e Polygon aparecem disponíveis via parceiros licenciados. A combinação de ativo e rede é confirmada com a Mutual antes da transferência; a lista não afirma que todo ativo existe nativamente em toda rede. A disponibilidade do parceiro não significa acesso operacional integrado nesta versão local. Prazos, confirmação em tempo real e repatriação no mesmo dia recebem a condição do trilho e do parceiro licenciado. Não há remessa de pessoa física.

A segurança afirma somente HSM/KMS, KYB/AML e 2FA; Travel Rule e chave dividida/recuperação estão em implantação. A segregação é atribuída aos parceiros licenciados, conforme contrato, sem relação numérica não comprovada. Nenhum parceiro é nomeado. A frase “Tecnologia pura. Parceiros executam.” acompanha o catálogo; a execução financeira é atribuída aos parceiros licenciados. Publicação permanece condicionada à revisão jurídica, especialmente das ofertas de contas, exchange, pagamentos e wealth.

Os sete idiomas têm os novos conteúdos e metadados, incluindo árabe com leitura da direita para a esquerda. Os dois temas reutilizam os tokens existentes; o claro continua sendo o inicial. O rodapé e os avisos legais da blindagem permanecem iguais à base, com as cinco colunas do Site A. O Site A e a referência v2 foram apenas consultados.

### Conferência desta rodada

`npm run build` e `npm run check` verificam 469 páginas. Traduções, cobertura, governança, rotas e troca de idioma incluem os novos destinos. `check:catalogue` exercita o controlador real do menu e das animações com eventos simulados: abertura, passagem do ponteiro, foco circular, Esc, fechamento, movimento reduzido e pausa. Isso não substitui o navegador. O cálculo de contraste abrange também o novo hero, sua legenda e as faixas de produto.

A comparação com a base `93d8d1c` confirmou os 3.234 textos anteriores e o conteúdo principal integral das 329 páginas anteriores, nos mesmos endereços. O único ajuste de hierarquia é o título antigo da home, que passa a subtítulo com o mesmo texto. O registro está em `artifacts/validacao-portas-catalogo.json`.

`npm run check:browser` exige agora 3.752 combinações: todas as 67 páginas em quatro larguras, sete idiomas e dois temas. Inclui cada porta aberta, duas colunas/acordeão, teclado, foco, Esc, acessibilidade, ausência de cortes e as animações com e sem movimento reduzido. A tentativa desta rodada foi impedida pelo ambiente: o Chrome encerrou antes da primeira página. Portanto, aparência real, axe, interação no Chrome, imagens comparativas e medidas de desempenho seguem sem comprovação. O relatório `artifacts/validacao-blindagem-browser.json` registra zero combinações executadas e retorna falha, sem aprovação parcial.

A versão segue exclusivamente local, com bloqueio de indexação. Não houve push nem publicação.

A gravação do commit único foi impedida pelo ambiente: `git add` não conseguiu criar `.git/index.lock` (`Operation not permitted`). Nenhum commit foi criado nesta rodada; todas as alterações permanecem na pasta de trabalho, sem preparação parcial para commit.
