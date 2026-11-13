# ADR 0001 — Demonstração empresarial segura

## Estado

Aceita em 2026-11-01.

## Contexto

O site precisa explicar proteção de dados, serviços Mutual e aplicações para setores regulados sem apresentar uma operação financeira ou um produto certificado que ainda não tenha comprovação própria. O material `16-ticker` foi fornecido como referência visual e contém um terminal de negociação inteiramente simulado.

## Decisão

- A página `/infraestrutura-empresarial/` usa a estrutura estática, os sete idiomas e as animações já existentes no projeto.
- A demonstração mostra apenas quatro etapas conceituais com texto sintético. Ela não recebe arquivos, dados pessoais, ordens, valores ou transações.
- Criptografia, gestão de chaves, confiança zero, privacidade, auditoria e continuidade aparecem como opções de arquitetura sujeitas a avaliação, contrato, testes e comprovação.
- Serviços financeiros permanecem ligados às páginas atuais e identificados como dependentes de parceiros licenciados.
- Países, moedas, limites, prazos e parceiros são confirmados por corredor. O site não herda a alegação de cobertura de terceiros.
- O material `16-ticker` não é incorporado como terminal, carteira ou mercado, evitando duplicar a arquitetura e sugerir operação real.

## Consequências

A comunicação fica adequada para avaliação empresarial e governamental, enquanto a publicação continua sem autenticação, formulários, consultas externas ou movimentação financeira. Uma demonstração operacional futura exigirá escopo, dados, parceiros, autorizações e validações próprios.
