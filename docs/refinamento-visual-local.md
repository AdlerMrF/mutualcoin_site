# Refinamento visual local da LP

Escopo: `/lp-app/`. Identidade preservada: navy, dourado, fontes e conteúdo existentes. Responsável: Codex.

`comparar.bat` abre duas versões da mesma página. `?comparacao=antes` desativa o refinamento; `?comparacao=depois` o ativa antes da primeira pintura. O site principal continua sendo a referência institucional.

## O que comparar

- Botões primários: acabamento dourado com luz superior, seta em círculo navy e sombra com profundidade. No hover, a seta muda de direção e um reflexo atravessa o botão uma vez.
- Botões secundários: superfície navy, contorno dourado e seta dourada, distinguindo-os da ação principal.
- Legendas: símbolos de equalizador removidos da versão refinada em toda a LP, incluindo o painel, os casos de uso e os destaques do topo. Textos e ícones de navegação e conferência preservados.
- Painéis e imagens: escala comum de sombras. O mascote usa um enquadramento quadrado e a imagem institucional mantém sua proporção original.
- Menu: abertura em 280 ms, foco contido e rolagem da página bloqueada enquanto estiver aberto.
- Bloco “A rede registra / Você confere”: equalizador e ícones de áudio substituídos por três blocos conectados e ícones de vínculo, ligação rompida e conferência. Textos explicativos preservados. O desenho das conexões acompanha a rolagem; não há repetição automática. No celular, registro precede conferência. A cena antiga permanece somente no modo de comparação “antes”.
- Movimento reduzido: elimina brilho animado, deslocamentos e animação de abertura, preservando as cores e os estados visíveis.

## Referências consultadas

O conector MCP da 21st não estava disponível nesta sessão. Foram consultadas as páginas públicas:

- [Shiny Button, Hyperiux](https://21st.dev/@hyperiux/components/shiny-button): referência de acabamento e reflexo na interação.
- [Border Beam, appica-dev](https://21st.dev/@appica-dev/components/border-beam/reveal-on-interaction): referência de realce condicionado à interação.
- [Klyv Animated Beam, 21st](https://21st.dev/@klyv-ui/components/klyv-animated-beam) e [Animated Beam, Magic UI](https://magicui.design/docs/components/animated-beam): referências públicas para a ligação entre blocos. O conector 21st foi novamente conferido e continuava ausente da sessão e de `codex mcp list`.

O CSS foi escrito para os componentes HTML existentes. Nenhum código desses componentes foi copiado e nenhuma dependência foi adicionada. O site não faz chamadas à 21st em execução.

Esta pasta está sem metadados Git. Estes ajustes são locais e não constituem publicação.

## Refinamento do registro e conferência

As superfícies usam navy, com destaque dourado apenas no bloco atual e nos ícones de conferência. As explicações preservam o texto original e usam divisórias em vez de balões de mensagem. As conexões acompanham a rolagem sem repetição automática. A seção ocupa menos rolagem e passa para uma coluna abaixo de 1024 px, mantendo registro antes de conferência.

Verificações: compilação local; enquadramento dos textos em 360, 768, 1024 e 1440 px; composição móvel; movimento reduzido; preservação do modo “antes”. Não houve uso do conector 21st nem inclusão de dependências.
