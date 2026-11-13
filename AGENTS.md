# Regras do projeto Mutucoin

## Destinos obrigatórios

- O código oficial pertence exclusivamente ao repositório privado `https://github.com/Mutual-Capital/mutucoin-site`.
- A publicação pertence exclusivamente à conta Cloudflare **Mutual | Global**, ID `14aeea46282365ca4559b74416191550`, projeto Pages `mutucoin-institucional`.
- O domínio provisório autorizado é `https://mutucoin.xyz`, incluindo `www.mutucoin.xyz`.
- MutualGit, Forgejo, Gitea e espelhos históricos servem somente como referência documental. Não adicionar dependências de execução, remotos de publicação, sincronização, automações ou credenciais desses ambientes.
- Google Cloud não é destino de execução ou publicação deste projeto. Eventuais recursos antigos só podem ser removidos após inventário que comprove seu vínculo com a Mutucoin, preservação do que for necessário e verificação da nova publicação. Não ampliar essa limpeza para recursos de outros projetos.
- Usar os serviços já disponíveis na conta. Não criar assinatura, compra ou custo adicional sem autorização específica.

## Publicação institucional

- Publicar somente `dist-public`, gerado por `npm run release:check` a partir de um estado limpo e já enviado ao ramo `main` do repositório oficial.
- O comando comum `npm run build` mantém a versão completa para trabalho local; esse resultado não deve ser publicado.
- A apresentação pública permanece sem operações financeiras, painel, autenticação, carteiras conectadas, consultas à API, formulários ou indexação enquanto essas funções não forem objeto de autorização e validação próprias.
- Preservar a política de conteúdo, os bloqueios de acesso, a validação de certificados e a autenticação dos registros do domínio. Registrar a versão do código, o pacote publicado e as verificações no domínio real.
- Não inserir segredos no código, nos arquivos públicos, nos relatórios ou no navegador.

## Comunicação e conferência

- Comunicar em português brasileiro, com linguagem simples.
- Informar porcentagem geral e por frente, responsável, etapa atual e próximo passo. Usar 100% apenas para etapas concluídas e verificadas.
- Antes de alterar código ou publicar, conferir pasta, raiz Git, remoto, ramo e estado dos arquivos.
- Não tratar respostas HTTP, compilação ou imagem de tela isoladas como prova suficiente. Conferir conteúdo, certificado e proteções aplicáveis no destino real.

Procedimento: [publicação e isolamento](docs/publicacao-e-isolamento.md).
