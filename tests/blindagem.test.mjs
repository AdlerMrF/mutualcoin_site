import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { languages, dictionaries, renderHTML, securityHeaders } from '../config/site.js';
import { createHash } from 'node:crypto';
const template = readFileSync('index.html', 'utf8');
const origin = 'https://mutucoin.local.invalid';
test('tema anterior à pintura: claro na primeira visita, preferência válida e armazenamento bloqueado', () => {
  const html = renderHTML(template,'pt-BR',origin);
  const boot = html.match(/<script data-theme-bootstrap>(.*?)<\/script>/s)?.[1];
  assert.ok(boot, 'Falta o tema aplicado no cabeçalho da página');
  assert.ok(html.indexOf(boot) < html.indexOf('<!-- seo:build -->') || html.indexOf(boot) < html.indexOf('rel="canonical"'));
  const hash = createHash('sha256').update(boot).digest('base64');
  assert.ok(securityHeaders(origin,false)['Content-Security-Policy'].includes(`'sha256-${hash}'`));
  for (const [value,expected] of [[null,'light'],['dark','dark'],['light','light'],['invalido','light'],['bloqueado','light']]) {
    const document = {documentElement:{dataset:{}}};
    runInNewContext(boot,{document,localStorage:{getItem(){if(value==='bloqueado')throw Error();return value;}}});
    assert.equal(document.documentElement.dataset.theme,expected);
  }
  assert.ok(!boot.includes('prefers-color-scheme'));
});
test('cinco colunas, contatos reais, proteção, transparência e perguntas traduzidas em todos os idiomas', () => {
  for(const language of languages){
    const html=renderHTML(template,language,origin);
    assert.equal([...html.matchAll(/class="footer-column"/g)].length,5);
    for(const address of ['suporte@mutualcapital.org','contato@mutualcapital.org','juridico@mutualcapital.org'])assert.ok(html.includes(`mailto:${address}`));
    for(const id of ['protecao','transparencia','faq'])assert.ok(html.includes(`id="${id}"`));
    const graph=JSON.parse(html.match(/type="application\/ld\+json">(.*?)<\/script>/s)[1])['@graph'];
    assert.ok(graph.some(item=>item['@type']==='Service'));
    const faq=graph.find(item=>item['@type']==='FAQPage');
    assert.equal(faq.mainEntity.length,4);
    for(const item of faq.mainEntity){assert.ok(html.includes(item.name));assert.ok(html.includes(item.acceptedAnswer.text));}
    assert.ok(html.includes(dictionaries[language]['theme.dark']));
  }
});

test('troca de tema sincroniza controles, preserva preferência e funciona com armazenamento indisponível', async () => {
  const {initTheme}=await import('../src/theme.js');
  const names=['document','localStorage','matchMedia','CustomEvent'];
  const original=Object.fromEntries(names.map(name=>[name,Object.getOwnPropertyDescriptor(globalThis,name)]));
  try{
    for(const language of languages)for(const blocked of [false,true]){
      let saved;const events=[];
      const root={dataset:{theme:'light'}};
      const buttons=Array.from({length:2},()=>({attrs:{},setAttribute(k,v){this.attrs[k]=v;},addEventListener(name,fn){this.click=fn;}}));
      const columns=Array.from({length:5},()=>({open:true}));
      globalThis.document={documentElement:root,getElementById:()=>({textContent:JSON.stringify({'theme.dark':dictionaries[language]['theme.dark']})}),querySelectorAll:selector=>selector==='[data-theme-toggle]'?buttons:columns,dispatchEvent:event=>events.push(event)};
      globalThis.localStorage={setItem(key,value){if(blocked)throw Error('Bloqueado');saved={key,value};}};
      globalThis.matchMedia=()=>({matches:true,addEventListener(){}});
      globalThis.CustomEvent=class{constructor(type,options){this.type=type;this.detail=options.detail;}};
      initTheme();
      assert.ok(columns.every(column=>!column.open));
      buttons[0].click();
      assert.equal(root.dataset.theme,'dark');
      assert.ok(buttons.every(button=>button.attrs['aria-pressed']==='true'&&button.attrs['aria-label']===dictionaries[language]['theme.dark']));
      if(!blocked)assert.deepEqual(saved,{key:'mutucoin-theme',value:'dark'});
      buttons[1].click();assert.equal(root.dataset.theme,'light');
      assert.deepEqual(events.map(event=>event.detail),['dark','light']);
    }
  }finally{for(const name of names){if(original[name])Object.defineProperty(globalThis,name,original[name]);else delete globalThis[name];}}
});

test('tradução faltando interrompe a página; não usa português como substituto', () => {
  for(const language of languages){
    const original=dictionaries[language]['hero.desc'];
    try{
      delete dictionaries[language]['hero.desc'];
      assert.throws(()=>renderHTML(template,language,origin),/Tradução ausente/);
    }finally{dictionaries[language]['hero.desc']=original;}
  }
});

test('acabamento Apple preserva identidade e oferece toque, menos transparência e mais contraste', () => {
  const css = readFileSync('src/assets/css/blindagem.css','utf8');
  assert.match(css,/:active\s*\{\s*scale:\.97/);
  assert.match(css,/@media\(prefers-reduced-transparency:reduce\)/);
  assert.match(css,/@media\(prefers-contrast:more\)/);
  assert.match(css,/font-optical-sizing:auto/);
  const publicEntry = readFileSync('src/public-preview.js','utf8');
  for (const feature of ['enterprise-impact.css','initAudienceNavigation','initVideos','enterprise-motion.js']) assert.ok(publicEntry.includes(feature));
});
