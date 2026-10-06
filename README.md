# Harley Aguilar — Portfólio

Site estático, sem build ou dependências externas. Português na raiz e inglês em `en/`, incluindo os quatro cases e 37 artes traduzidas. O seletor PT/EN mantém a página e a seção. Experiência: 4+ anos.

## Publicação
Extraia o pacote e envie o conteúdo da pasta para a raiz do repositório. Não publique o arquivo ZIP. Para upload pelo navegador, envie `assets` em um lote e as demais pastas e arquivos em outro: o GitHub aceita até 100 arquivos por envio e 25 MiB por arquivo. Cada arquivo deste site fica abaixo de 2,5 MiB. Em Settings → Pages, publique a branch pela raiz (`/`).

## Imagens e desempenho
As imagens completas e as ampliações mantêm resolução, cores e pixels. A compressão WebP é sem perda; a equivalência dos pixels foi verificada. A geometria dos SVGs foi preservada, e somente suas imagens embutidas foram recomprimidas sem perda. Os vídeos originais permanecem idênticos.

As faixas animadas usam miniaturas específicas em `thumbs/`, dimensionadas para até 2× a altura máxima de exibição. `srcset` e `sizes` permitem que o navegador selecione a imagem completa quando a densidade da tela exigir. As galerias e os links de ampliação sempre usam a arte completa. Essas miniaturas adicionam arquivos ao pacote para reduzir os dados transferidos durante a navegação; o tamanho total do pacote permanece próximo ao anterior.

Imagens abaixo da primeira tela usam carregamento sob demanda. Vídeos não pré-carregam metadados e pausam ao sair da área visível. Reprodução automática respeita movimento reduzido, economia de dados e aba oculta; o botão de reprodução continua disponível.

## Manutenção
`assets/js/app.js` contém os controles em português e `assets/js/app.en.js`, em inglês. Mantenha ambos sincronizados ao alterar comportamentos. `assets/projects/en/` contém as artes inglesas. Os originais em português são preservados. A ficha de RPG em inglês tem imagem ampliável traduzida e um link identificado para a animação original em português.

## Social media
A home inclui uma seção com acesso ao case `projects/social-media.html`, também traduzido em `en/projects/social-media.html`. Cinco Shorts recentes têm reprodução incorporada carregada apenas após o clique e links para YouTube e TikTok. Um único player fica ativo por vez.

Os números públicos foram consultados em 06/10/2026 e estão documentados, com fontes e limitações, em `assets/data/social-media.json`. Contagens abreviadas são aproximadas. Não representam alcance único, retenção ou analytics privados. A atualização dos números é manual: altere o JSON e os textos nas duas homes e nos dois cases, mantendo a data da consulta. `assets/css/social-media.css` e `assets/js/social-media.js` cuidam da apresentação e reprodução.
