# Publicação e isolamento da Mutucoin

## Regra permanente

Código oficial: **GitHub Mutual-Capital/mutucoin-site**, em repositório privado. Hospedagem: **Cloudflare Mutual | Global**, projeto Pages **mutucoin-institucional**. Domínio provisório: **mutucoin.xyz**, com **www**.

MutualGit e espelhos legados são fontes históricas de consulta. O projeto não depende deles para instalar dependências, gerar arquivos, executar o site ou publicar. Menções em `FONTES.md` registram a origem documental, sem vínculo de execução.

Google Cloud não faz parte da operação deste site. A eventual limpeza de cópias antigas deve ocorrer depois de: identificar exatamente os recursos da Mutucoin; preservar arquivos e informações necessários; conferir a versão independente; validar domínio, certificado e proteções; revisar o plano de recuperação. Recursos de outros projetos permanecem fora desse escopo.

## Preparar uma versão

1. Conferir pasta, origem GitHub, ramo `main` e ausência de alterações locais.
2. Registrar as alterações e enviá-las ao repositório privado oficial.
3. Executar `npm run release:check`. O comando confirma o destino, compara a versão com o GitHub, gera a apresentação pública e verifica os arquivos resultantes.
4. Preparar um pacote somente de `dist-public`. Não incluir dependências, fontes, arquivos de ambiente, histórico Git, telas operacionais ou relatórios internos.
5. Entrar na conta Cloudflare **Mutual | Global**, conferir seu ID `14aeea46282365ca4559b74416191550` e o projeto **mutucoin-institucional**, e publicar o pacote por envio direto. O envio direto mantém a publicação independente de serviços legados e não exige criar outra assinatura.
6. Registrar o commit do GitHub, o resumo SHA-256 do pacote e a identificação da publicação Cloudflare. Conferir os dois domínios, o certificado, a apresentação no navegador e as proteções no endereço real.

O processo por envio direto não se apresenta como publicação automática. Não introduzir chaves permanentes ou novas integrações sem necessidade e autorização. A verificação de destino impede o uso acidental de outra origem Git no procedimento oficial, mas não substitui a conferência da conta e do projeto na hora do envio.

## Versões e limites

- `npm run dev` e `npm run build` preservam a versão completa para trabalho local. Não usar esse resultado como pacote público.
- `npm run build:public-preview` gera a apresentação institucional sem painel, operações financeiras, chamadas à API ou widgets de outras páginas.
- `npm run check:public-preview` confere o pacote público.
- `npm run release:check` é o procedimento oficial de preparação de publicação e exige correspondência com o GitHub.
- `artifacts/` e partes históricas do README são evidências de passadas anteriores; não são arquivos de publicação nem comprovam o estado atual.

Os dados de acesso ficam nos mecanismos autenticados do usuário, nunca no código. A política em `config/publication-policy.json` contém apenas identificadores públicos de destino.

## Ponto de controle operacional — 1º de novembro de 2026

### Versões e responsável

- Responsável atual pela conferência e preparação: **Codex, frente Mutucoin**.
- Código institucional no GitHub: ramo `main`, commit `2925cc468a3463db2149bdc6c6aa14769f863940`.
- Cloudflare Pages: implantação de produção `b5a9c540-dcb8-4e40-af60-84ae370d4fe1`, concluída com sucesso e associada a `mutucoin.xyz` e `www.mutucoin.xyz`.
- Demonstração: Worker `mutucoin-demonstracao`, implantação `1a650438-d7a2-4767-8bef-cb096be88b89`, servindo 100% da versão `5270f2e5-02ff-4e79-bbe1-60f83598bfea` em `demonstracao.mutucoin.xyz`.

### Evidência verificada

- `https://mutucoin.xyz/infraestrutura-empresarial/` respondeu com sucesso e contém a demonstração oficial `https://demonstracao.mutucoin.xyz/`.
- O domínio principal entrega HSTS, política de conteúdo restrita, bloqueio de enquadramento externo, proteção contra interpretação indevida de arquivos, política de referência e bloqueio de indexação.
- `https://www.mutucoin.xyz/` e `https://demonstracao.mutucoin.xyz/` responderam com sucesso.
- A demonstração consultou a fonte pública da OKX para `BRL1-BRL` e a API pública oficial da Mutucoin para MutualChain. Essas leituras comprovam somente exibição de dados públicos; não comprovam negociação, liquidação ou disponibilidade financeira.

### Separação obrigatória de estado

- **Site institucional:** publicado e verificado para apresentação pública, ainda marcado como conteúdo em implantação e sem indexação.
- **Demonstração:** publicada e funcional para navegação e leitura pública. Não envia ordens, valores, transações nem dados de carteira.
- **Funcionamento financeiro:** **não comprovado e não autorizado por este ponto de controle**. O site e a demonstração não validam proteção operacional de ativos, saldo, cotação executável, roteamento, liquidação, conciliação ou movimentação de dinheiro.

### Dependências reais da P0 financeira

Antes de qualquer afirmação ou ativação financeira, a frente responsável pela P0 precisa comprovar, na versão exata: provedores e contas autorizados; ativo, rede, método e rota; limites e horários; KYC/KYB, AML e sanções; autenticação forte e separação de funções; gestão de segredos e chaves; cotação executável; idempotência; conciliação; trilha de auditoria; monitoramento; recuperação; testes de ponta a ponta em ambiente autorizado; revisão jurídica e autorização expressa para movimentar valor.

O próximo marco desta frente é manter a apresentação e a demonstração estáveis enquanto a P0 financeira produz essas evidências próprias. Nenhuma etapa do site deve ser usada para antecipar ou substituir a aprovação financeira.
