# Artes dos casos de uso

Responsável: Codex. Alterações locais na LP experimental, sem publicação.

- `public/img/marketplace-americas-transparent.png`: última versão do mapa enviada pelo usuário (`hf_20261110_174134_28312b38-e8cd-4021-8128-fbd1c7cca0d9 (1).png`), no cartão E-commerce internacional.
- `public/img/api-base-transparent.png`: referência `hf_20261110_182521_daef89cf-a361-4725-8121-c0047838227a.png`, restaurada no cartão Fintechs e PSPs, sem símbolos incorporados.
- `public/img/pix-fornecedor-transparent.png`: referência `hf_20261110_175109_00bbeb30-2c59-4e6a-b955-80810e3a8a49.png`, restaurada no cartão Importação e Exportação, sem símbolos incorporados.
- `public/img/tesouraria-caixa-transparent.png`: referência `hf_20261110_195520_cc1fcfcd-1c1f-46aa-90c5-e05724524f73.png`, no cartão Tesouraria em stablecoin. Recorte nativo `imagegen`: remover somente o branco externo, preservando gaveta aberta, moedas internas, faces de prata e monograma dourado como elementos opacos. Nenhuma moeda flutuante incorporada ao PNG.
- `public/img/token-usdc.webp`, `token-pix.jpg` e `token-usdt.jpg`: cópias dos logotipos fornecidos pelo usuário. São elementos separados das bases. O USDC já possui alfa; o branco do Pix é removido por filtro SVG limitado à imagem, e a margem do USDT é recortada em círculo, preservando seu T branco. Não há molduras.

O Pix recebe cinza sólido `#aab2bf` e cantos suavizados pela máscara alfa. O contorno é recomposto para continuar nítido; o blur de movimento permanece separado e só aparece ao rolar.

Os recortes das artes-base foram produzidos com a ferramenta nativa `imagegen`, com fundo transparente. O enquadramento usa `object-fit: contain`, reserva espaço para as legendas e preserva a comparação anterior em `?comparacao=antes`.

## Instruções de edição utilizadas

Mapa: remover apenas o fundo branco, incluindo os espaços entre as ilhas; preservar forma, perspectiva, proporções, extrusão, dourado, fronteiras existentes e a área sem marcações na América do Norte; não inventar linhas geográficas ou objetos. Gerar recorte PNG transparente para sobreposição ao navy.

Importação: remover apenas o fundo branco e o espaço sob a seta; preservar moeda e logotipo Mutual, seta, contêiner, cores, geometria, perspectiva e composição; manter opacas as faces claras da moeda e do contêiner. Gerar recorte PNG transparente para sobreposição ao navy.

API: remover somente o fundo branco da referência, preservando monograma, faces claras, colchetes e pilha de moedas; não adicionar USDC/USDT ou outros elementos à imagem.

Movimento: os cinco símbolos Pix do primeiro cartão e as seis moedas USDC/USDT do segundo saltam em sequência de trás da arte principal. A camada das moedas fica abaixo do símbolo, com destinos ao redor dele. O segundo cartão inicia depois do primeiro, e ambos retornam ao inverter a rolagem. A tesouraria mantém a saída mais forte da gaveta, com amplitude reduzida no celular. As moedas permanecem nítidas em repouso; o blur de 0,65 px aparece somente durante a rolagem e some ao parar. Movimento reduzido mantém os ícones distribuídos sem salto. Artes-base e textos permanecem nítidos.

O cartão Tesouraria em stablecoin ocupa a terceira posição na versão refinada. A movimentação no DOM ocorre antes das medições da cena. O modo “antes” preserva a ordem original.

Verificações: compilação local; carregamento e alfa da nova arte; avanço/retorno da tesouraria; ordem no computador e celular; ícones dos dois primeiros cartões sempre visíveis; pausa fora da tela; moedas acima das legendas; ausência de transbordamento; movimento reduzido com zero animações em execução. Em movimento reduzido ou sem suporte às animações de rolagem, a composição permanece estática e legível.

Agro e commodities: a arte enviada em hf_20261110_202543_c20738eb-4ae2-4417-b4f0-f19cc8cc2118.png foi recortada com imagegen (ferramenta integrada) e salva em public/img/agro-commodities-transparent.png. Prompt: remover apenas o fundo branco e o plano de chão, preservando seta azul, monogramas Mutual, silo, trigo, composição e materiais; PNG com transparência real. O quadro Agro aparece por último na versão refinada, após E-commerce. A versão antes mantém a ordem e a imagem originais. Compilação e encaixe visual conferidos em desktop e celular.

Marketplace no main: as imagens hf_20261110_210522_4b8727fa-b7e3-41e0-ba86-9573c91470d7.png e hf_20261110_210538_3e64fb4d-736f-444a-b4f7-a7127ae9a93c.png foram preparadas com imagegen integrado. Prompt: remover somente o fundo branco, preservar as lojas 3D, logo Mutual, materiais, cores e perspectiva, com alpha transparente e contorno nítido. Arquivos finais: public/img/marketplace-store-gold-transparent.png e public/img/marketplace-store-silver-transparent.png. Quatro instâncias alternam os dois modelos, emergindo em sequência por trás do mapa. O salto acompanha a entrada do próprio cartão e retorna ao inverter a rolagem; blur somente ao rolar. Desktop e celular conferidos; movimento reduzido mantém as lojas visíveis e estáticas. Atualização restrita à LP do main, sem alterar as cópias dos pacotes organizados.

Ajuste de densidade do marketplace: ficam somente duas lojas, uma dourada e uma prateada, nas laterais superiores do mapa. Mantidos salto sequencial por trás da arte e retorno com a rolagem.

Mascote do main: recorte criado com imagegen integrado a partir de public/img/mutucoin-mascot-3d.jpeg e salvo em public/img/mutucoin-mascot-transparent.png. Prompt: remover somente cenário branco/cinza, painéis, piso e reflexo; preservar integralmente robô, pose, mãos, rosto, logos, texturas e cores, com transparência real nos contornos e espaços entre membros. A versão depois usa o PNG e contêiner sem fundo, borda ou sombra; a versão antes mantém o JPEG. Alpha confirmado, compilação aprovada e encaixe conferido em 1440 e 390 px.

Movimento do robô: a versão transparente acompanha a rolagem com deslocamento vertical de +22 a -22 px, inclinação de -3 a +3 graus e escala de 0,97 a 1,02. No celular, deslocamento de 12 px e inclinação de 2 graus. Timeline CSS vinculada ao contêiner, reversível ao voltar o scroll, sem ciclo automático e sem blur permanente. Movimento reduzido mantém o robô estático. Compilação, reversão e encaixe em desktop/celular conferidos.

Robô maior e USDT: removido o padding do recorte e ampliada a proporção da coluna no desktop. Uma moeda USDT independente levita sobre a palma aberta, com oscilação vertical/rotação suave e sombra oval discreta na mão. Robô e moeda compartilham o movimento de scroll para preservar o alinhamento. A flutuação pausa fora da tela e em aba oculta; movimento reduzido mantém a composição estática. Moedas Pix, USDC e USDT dos cartões receberam sombras de contato e difusa com deslocamento vertical; a USDT do robô recebeu sombra mais suave e contorno iluminado discreto. O blur dos cartões continua restrito à rolagem, composto com as sombras.

Ajuste da moeda na mão: posição vertical elevada de 49% para 44% do conjunto do robô, preservando a sombra na palma e a oscilação de levitação.
