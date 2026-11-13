import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import postcss from 'postcss';
const base=postcss.parse(await readFile('src/assets/css/mutucoin.css','utf8'));
const sheet=postcss.parse(await readFile('src/assets/css/blindagem.css','utf8'));
const catalogue=postcss.parse(await readFile('src/assets/css/catalogue.css','utf8'));
const properties=(tree,selector)=>{const values={};tree.walkRules(rule=>{if(rule.selector.split(',').map(value=>value.trim()).includes(selector))rule.walkDecls(declaration=>{values[declaration.prop]=declaration.value;});});return values;};
const dark={...properties(base,'.mutucoin-site'),...properties(sheet,'.mutucoin-site')};
const light={...dark,...properties(sheet,":root:not([data-theme='dark']) .mutucoin-site")};
const luminance=color=>{
 const hex=color.replace('#','');
 const values=(hex.length===3?[...hex].map(value=>value+value).join(''):hex).match(/../g).map(value=>parseInt(value,16)/255).map(value=>value<=.04045?value/12.92:((value+.055)/1.055)**2.4);
 return values[0]*.2126+values[1]*.7152+values[2]*.0722;
};
const pairs=[
 ...[['dark',dark],['light',light]].flatMap(([theme,tokens])=>[
   [theme,'texto',tokens['--b-text'],tokens['--b-bg']],
   [theme,'secundário',tokens['--b-muted'],tokens['--b-surface']],
   [theme,'link',tokens['--b-link'],tokens['--b-surface']],
   [theme,'rodapé',tokens['--footer-muted'],tokens['--footer-surface']],
   [theme,'estado de foco e hover',tokens['--b-muted'],tokens['--b-hover']],
 ]),
 ['both','botão principal',properties(sheet,'.mutucoin-site .shiny-cta').color,dark['--b-accent']],
 ['both','legenda do mascote',properties(sheet,'.mascote-figure figcaption').color,properties(sheet,'.mascote-figure').background],
 ['both','hero de orquestração',properties(catalogue,'.mutucoin-site .orchestration-hero').color,properties(catalogue,'.mutucoin-site .orchestration-hero').background],
 ['both','legenda da orquestração',properties(catalogue,'.orchestration-hero .orchestration-figure figcaption').color,properties(catalogue,'.mutucoin-site .orchestration-hero').background],
 ['both','faixa de produto',properties(catalogue,'.product-band').color,properties(catalogue,'.product-band').background],
];
for(const [theme,name,foreground,background]of pairs){
 const a=luminance(foreground),b=luminance(background),ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);
 assert.ok(ratio>=4.5,`${theme}/${name}: contraste abaixo de AA (${ratio})`);
}
console.log(`Contraste: ${pairs.length} pares de texto/fundo atendem ao mínimo AA; não substitui axe ou revisão visual.`);
