# Site B · Fontes e pendências

Conteúdo preparado exclusivamente a partir das fontes autorizadas pelo brief. A leitura não alterou referências, espelho ou PDF. As fontes históricas descrevem capacidade e planejamento; não comprovam disponibilidade atual.

| Fonte | O que foi reaproveitado ou adaptado |
|---|---|
| Site A, base local `6b3b0df` | Cabeçalho, menu de celular, cartões, tipografia Montserrat, navy/amarelo, três molduras SVG, controles de pausa, GSAP/Lenis, idiomas, metadados estáticos e política de segurança. O grafo recebeu os 14 nós pedidos. |
| `../mutucoin-site-brief.md`, leitura integral | Dez páginas, sete idiomas, nomes, lista de meios de pagamento e redes, estado de implantação e limites de conteúdo. |
| `../mutucoin-site-ref-etana.md`, leitura integral | Ordem da home: hero em ato → apresentação B2B sem contador → ecossistema → missão/estratégia/equipe → contato → downloads. Nenhum texto, marca ou logotipo foi copiado da referência externa. |
| `../mutucoin-integracao-cofre-desenho.md`, seções 7 e 8 completas | Identificadores de rede, EVM, Clique PoA, MTC/OHR, contrato MTC; proposta de Mutual Cartório, lotes, registros fora da rede e limites da prova. A ancoragem está apresentada como proposta em implantação. |
| Espelho `MutualTecnologia__front-mutucoin-platform.git`, HEAD `5469cc4fd210d4e6da2c3e36c26e4bceae6351de` | Papel de MTC/MutualChain, identidade e vínculo de carteira, rede permissionada, relatórios, limitações do explorador, modelo de carteiras ainda em definição, separação entre Hub e troca de ativos tokenizados, bloqueio do preço estático. Leitura por `git show`, sem checkout. |
| PDF autorizado, código `MTC-WEB-SPEC-2026-001`, data-base 22/09/2026 | Apresentação institucional e modular, B2B, requisitos de carteiras, relatórios, status, separação de ambientes, integração institucional, documentação e limites de comunicação. |

O PDF foi extraído localmente com PDFKit, 46 páginas. Embora o nome do arquivo termine em `v1.1.pdf`, a capa e o controle documental declaram versão **1.0**. Foram conferidos integralmente os trechos pertinentes: §§1–5, 7–8, 12–13, documentação/termos/contato e §§19–24. O PDF é classificado como interno e não foi copiado para os downloads públicos.

## Caminhos de conteúdo do espelho

- `docs/product/tese.md`: papel da rede e do MTC; a própria fonte registra que a mensagem comercial ainda requer aprovação do dono.
- `docs/product/site-publico/institucional.md` e `explorer.md`: apresentação, ausência de métricas inventadas e dependências do explorador.
- `docs/product/mutualchain/mutualchain.md` e `parametros-da-rede/parametros-da-rede.md`: ambientes e parâmetros.
- `docs/product/mtc-e-cotacao/ficha-do-mtc/ficha-do-mtc.md` e `cotacao/cotacao.md`: ficha, origem e contexto da referência de preço.
- `docs/product/carteiras/carteiras.md`: carteira externa e modelo ainda sujeito a decisão.
- `docs/product/acesso-e-identidade/vinculo-de-carteira/vinculo-de-carteira.md` e `fluxo-vincular-carteira.md`: identidade, assinatura e revisão administrativa.
- `docs/product/multi-rede/multi-rede.md`: catálogo como descrição, sem presumir cada capacidade operacional.
- `docs/product/white-label/white-label.md`: integração sob a marca do parceiro.
- `docs/product/integridade/registrar/fluxo-registrar.md`: somente prova resumida na rede e ausência de validade jurídica própria.
- `docs/integration/on-chain.md` e `integration.md`: parâmetros e lacunas que limitam as afirmações públicas.

## Pendências do dono

1. Aprovar missão, estratégia e redação institucional nos sete idiomas; enviar equipe e funções. As formulações apresentadas estão explicitamente pendentes.
2. Confirmar identificação jurídica, jurisdições, escopo institucional/VASP e participantes. Nenhuma autorização regulatória é presumida.
3. Confirmar e-mail comercial, endereço de entrada da plataforma e destino público do explorador. Não foram criados contatos ou links de acesso fictícios.
4. Entregar whitepaper, termos, privacidade e documento de rede aprovados, com versões e arquivos públicos. As linhas de download mostram pendência sem links falsos.
5. Aprovar fonte, responsável, periodicidade e arquivos de relatórios; lista pública de carteiras e provas de titularidade.
6. Decidir modelo de carteira e integração ao Mutual Cofre de Ativos Digitais; homologar o Hub e seus fluxos. Este site é apenas uma apresentação.
7. Aprovar fonte da cotação MTC com par, rede e horário; o número estático histórico foi excluído. Os widgets TradingView mostram apenas referências externas.
8. Homologar monitoramento, incidentes e atualização do estado da rede; confirmar cada integração e cobertura dos meios de pagamento/redes. Os rótulos indicam implantação, sem medidas fictícias.
9. Para Mutual Cartório: aprovar contrato, confirmações, responsáveis e análise jurídica. O desenho não comprova ancoragem ativa.

## Verificações e limite

- `npx vite build`: geração local das 70 páginas.
- `npm run check`: 70 páginas aprovadas, com 160 textos em cada idioma, links, navegação, alternativas de idioma por página, ordem da home, recursos locais, dados estruturados e proteção.
- Conferência isolada da troca de idioma: 490 combinações aprovadas, preservando página, parâmetros e trecho selecionado. Essa conferência não substitui interação real no navegador.
- Busca do termo vedado: sem ocorrência nos arquivos textuais do projeto, excluindo dependências e histórico interno da base.
- `npm run check:browser`: revisão preparada para abrir arquivos por interceptação, sem servidor. **Execução impedida pelo ambiente:** o navegador encerra ao iniciar por falta de permissão do sistema. A ferramenta de navegação também não oferece navegador disponível. Layout, interação real e acessibilidade visual permanecem sem validação; detalhes em `artifacts/validacao-navegador.json`.
- Nenhum servidor, publicação ou commit realizado.

## Fontes da passada B5

- `../mutucoin-site-brief.md`: Serviços, identidade, sete idiomas, preservação da base e redação financeira via parceiro licenciado.
- `../mutucoin-api-mapa.md`: fonte do inventário de 15 abas, seis referências de URL, 14 módulos e 12 itens adicionais. `config/mapa-plataforma.json` foi gerado a partir das seções 2, 3 e 4, sem copiar observações de segurança ou conteúdo pessoal. O mapa descreve o painel atual; não comprova a ativação da nova versão.
- `docs/product/modulos.md` do espelho autorizado, lido por `git show`: conferência do escopo por módulo. Para a cobertura atual, prevalece o mapa fornecido pelo dono nesta passada, inclusive onde ele amplia o inventário histórico do espelho.
- `../mutucoin-integracao-cofre-desenho.md`, seções 7 e 8: distinção entre rede, token e proposta de registro digital. Não foi ligada nenhuma integração.

A comparação de preservação partiu de `87fda4ce00ae7d0018bf7a62f55d0b4cf8ef5ba9`, em uma cópia temporária de leitura dos arquivos versionados. O conteúdo principal das 77 páginas e os 1.407 textos anteriores foram comparados integralmente; as únicas adições ao conteúdo principal anterior são as chamadas de Serviços na home. Build e verificações automatizadas: aprovados para 329 páginas. Revisão visual no navegador: impedida pelo ambiente. Não há confirmação de operação financeira ou publicação.

### Passada B6: leitura pública limitada

Fonte do contrato de leitura: `../mutucoin-api-mapa.md`, especialmente seções 2.1–2.3, 2.7–2.8, 2.16 e 6, junto de `config/plataforma.json` e `config/mapa-plataforma.json`. A configuração explícita está em `config/leitura-publica.json`. Nenhuma operação de escrita do mapa foi acrescentada ao adaptador.

Cartório usa somente a lista pública, com busca local limitada a 50 registros, pois a verificação direta documentada exige POST. Contratos usa os artefatos públicos de `/api/v1/artifacts`; não acessa a listagem administrativa. Campos de texto livre que possam identificar pessoas são descartados antes da tela. API e navegador ficaram inacessíveis no ambiente de execução; formatos e comportamento ao vivo permanecem sem confirmação. Testes usam somente dados sintéticos.

### Passada de animações

Referência visual descrita pelo dono: títulos que acendem, cartões com entrada lateral, colunas em sentidos opostos e contadores progressivos. Textos, ilustrações geométricas e estilos novos são próprios; não foi usado código, imagem, logotipo ou texto de corretora.

Fontes de dados permanecem as formas `ativos` e `preco` do adaptador B6, com os caminhos exatos já aprovados em `config/leitura-publica.json`. Volume e carteiras ativas não possuem leitura pública aprovada e ficam sem número. Total de ativos não é apresentado como total de pares negociáveis. O catálogo de redes existente foi centralizado em `config/catalogo-redes.js`, sem alterar seus itens ou seus estados. Os destinos dos cartões são as áreas existentes de `config/plataforma.json`. Os testes usam amostras isoladas, nunca valores de demonstração no site.
