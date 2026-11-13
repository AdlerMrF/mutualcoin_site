import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { languages, pages, dictionaries, languagePath, securityHeaders, headerFile } from '../config/site.js';
import { resolvePath, navigationPages } from '../config/routes.js';
import { findPlatformPage } from '../config/plataforma.js';
import { audiences } from '../config/audiences.js';
const read = (path) => readFile(path, 'utf8');
const first = await read('dist/index.html');
const origin = new URL(first.match(/rel="canonical" href="([^"]+)"/)[1]).origin;
const headers = securityHeaders(origin,false);
assert.equal(await read('dist/_headers'),headerFile(headers));
assert.ok(!headers['Content-Security-Policy'].includes('unsafe-inline'));
assert.ok(Buffer.byteLength(headers['Content-Security-Policy']) <= 8192, 'Política de segurança acima de 8 KB');
assert.equal(headers['X-Robots-Tag'],'noindex, nofollow, noarchive');
assert.ok((await read('dist/robots.txt')).includes('Disallow: /'));
const baseline = Object.keys(dictionaries['pt-BR']).sort();
const legalKeys = new Set(['position.title','position.desc',...Array.from({length:3},(_,i)=>[`position.${i+1}.title`,`position.${i+1}.desc`]).flat()]);
const restricted = /cust\u00f3d|cust\u006fd|self[- ]cust|Verwahrung|Verwahrungs|カストディ|حفظ الأصول/i;
const providerClaim = /provedor[a]? de liquidez|liquidity provider|proveedor[a]? de liquidez|Liquidit\u00e4tsanbieter|fornitrice di liquidit\u00e0|fornitore di liquidit\u00e0|流動性プロバイダー|مزود السيولة/i;
const all = new Map();
for (const language of languages) {
  assert.deepEqual(Object.keys(dictionaries[language]).sort(),baseline,`Traduções incompletas: ${language}`);
  assert.ok(Object.values(dictionaries[language]).every(value=>typeof value==='string'&&value.trim()));
  for(const [key,value] of Object.entries(dictionaries[language])) {
    assert.ok(legalKeys.has(key)||!restricted.test(value),`Termo fora do aviso legal: ${language}/${key}`);
    assert.ok(!providerClaim.test(value),`Posicionamento incompatível: ${language}/${key}`);
  }
  for (const page of Object.keys(pages)) {
    const path = languagePath(language,page);
    const html = await read(`dist${path}index.html`);
    all.set(path,html);
    assert.deepEqual(resolvePath(path),{language,page});
    assert.deepEqual(resolvePath(`${path}index.html`),{language,page});
    assert.ok(html.includes(`<html lang="${language}" dir="${language==='ar'?'rtl':'ltr'}">`));
    assert.equal([...html.matchAll(/<h1\b/g)].length,1,`Título principal: ${path}`);
    assert.ok(!/undefined|\{\{|<!-- (?:seo|site):/.test(html),`Marcador não resolvido: ${path}`);
    assert.ok(!/<[^>]+\sstyle=|<style\b|\son\w+=/.test(html),`Conteúdo sem proteção: ${path}`);
    assert.ok(html.includes('name="robots" content="noindex, nofollow, noarchive"'));
    assert.ok(html.includes(`rel="canonical" href="${origin}${path}"`));
    for (const target of [...languages,'x-default']) {
      const targetPath=languagePath(target==='x-default'?'pt-BR':target,page);
      assert.ok(html.includes(`hreflang="${target}" href="${origin}${targetPath}"`),`Alternativa incorreta: ${path}/${target}`);
    }
    for (const tag of ['description','og:title','og:description','og:image','og:url','twitter:card','twitter:title']) assert.match(html,new RegExp(`(?:name|property)="${tag}"[^>]*content="[^"]+"`));
    const jsonScripts=[...html.matchAll(/<script type="application\/(?:ld\+json|json)"[^>]*>(.*?)<\/script>/gs)];
    const organization=JSON.parse(jsonScripts[0][1])['@graph'].find(item=>item['@type']==='Organization');
    assert.equal(organization.legalName,'Mutual Capital Tecnologia Financeira e Participações Ltda.');
    assert.equal(organization.taxID,'09.232.421/0001-12');
    assert.deepEqual(organization.address,{'@type':'PostalAddress',streetAddress:'Rua Aguaçu, 171, Bloco E, Sala M17, Alphaville',addressLocality:'Campinas',addressRegion:'SP',postalCode:'13098-321',addressCountry:'BR'});
    const identities=[...html.matchAll(/<address\b[^>]*>(.*?)<\/address>/gs)];
    assert.equal(identities.length,page==='home'||page==='contact'?2:1);
    for(const [,identity] of identities)for(const key of ['legal.company','legal.tax','legal.address'])assert.ok(identity.includes(dictionaries[language][key]));
    const withoutNotice=html.replace(/<section id="aviso-legal"[\s\S]*?<\/section>/g,'');
    assert.ok(!restricted.test(withoutNotice),`Termo fora do aviso legal: ${path}`);
    if(page==='contact')for(const key of legalKeys)assert.ok(html.includes(dictionaries[language][key]));
    const videos=[...html.matchAll(/<video\b([^>]*)>(.*?)<\/video>/gs)];
    assert.equal(videos.length,['home','ecosystem','enterprise'].includes(page)?2:page==='blockchain'?1:0);
    for(const [,attrs,source] of videos){
      for(const attr of ['autoplay','muted','loop','playsinline'])assert.match(attrs,new RegExp(`\\b${attr}\\b`));
      assert.ok(attrs.includes('preload="metadata"'));
      const poster=attrs.match(/poster="([^"]+)"/)[1];
      const video=source.match(/data-src="([^"]+\.mp4)"/)[1];
      await access(resolve('dist',`.${poster}`));await access(resolve('dist',`.${video}`));
    }
    assert.ok(!/<canvas\b|class="story-art"/.test(html.replace(/<figure class="mascote-figure"[\s\S]*?<\/figure>/g,'')),'Canvas fora do mascote ou recriação na moldura de vídeo');
    assert.equal([...html.matchAll(/<canvas\b/g)].length,page==='home'?1:0,'Canvas exclusivo do mascote');
    assert.equal(jsonScripts.length,2);
    for(const [,content] of jsonScripts){
      JSON.parse(content);
    }
    for(const [,attrs,content] of html.matchAll(/<script\b([^>]*)>(.*?)<\/script>/gs)){
      if (/\bsrc="/.test(attrs) || /\btype="application\/(?:ld\+json|json)"/.test(attrs)) continue;
      assert.ok(headers['Content-Security-Policy'].includes(`'sha256-${createHash('sha256').update(content).digest('base64')}'`),`Proteção do código: ${path}`);
    }
    const ids=[...html.matchAll(/(?<![\w-])id="([^"]+)"/g)].map(m=>m[1]);
    assert.equal(ids.length,new Set(ids).size,`Identificador duplicado: ${path}`);
    for(const [,attribute,value] of html.matchAll(/\b(aria-controls|aria-describedby|aria-labelledby)="([^"]+)"/g)) for(const id of value.split(' ')) assert.ok(ids.includes(id),`${attribute}: ${id}`);
    for(const [,tag,attrs] of html.matchAll(/<([\w-]+)\b([^>]*)>/g)){
      const attributes=Object.fromEntries([...attrs.matchAll(/([\w:-]+)="([^"]*)"/g)].map(m=>[m[1],m[2]]));
      if(tag==='img')assert.ok(attributes.width&&attributes.height&&attributes.alt!==undefined,'Imagem sem dimensões ou descrição');
      for(const [name,key] of Object.entries(attributes)) if(name.startsWith('data-i18n')) assert.ok(key in dictionaries[language]||key.startsWith('meta.'),`Tradução ausente: ${path}/${key}`);
    }
    const navs=[...html.matchAll(/<nav\b[^>]*>(.*?)<\/nav>/gs)];
    const commonNavs=navs.filter(([open])=>!open.includes('class="app-navigation"'));
    assert.equal(navs.length,findPlatformPage(page)||page==='app'?4:3,`Navegação da página: ${path}`);
    assert.equal(commonNavs.length,3,`Navegação comum: ${path}`);
    for(const [open,nav] of commonNavs){
      if (open.includes('audience-navigation') || open.includes('audience-mobile-navigation')) {
        assert.equal([...nav.matchAll(/data-audience-door=/g)].length,4,'Quatro portas no cabeçalho');
        for(const audience of audiences) {
          assert.ok(nav.includes(`data-i18n="audience.${audience.id}.title"`));
          assert.ok(nav.includes(`href="${languagePath(language,audience.id)}"`));
        }
        assert.ok(nav.includes(`href="${languagePath(language,'contact')}"`));
        continue;
      }
      assert.equal([...nav.matchAll(/<a /g)].length,Object.keys(navigationPages).length);
      assert.equal([...nav.matchAll(/aria-current="page"/g)].length,Object.hasOwn(navigationPages,findPlatformPage(page)?'app':page)?1:0);
      for(const target of Object.keys(navigationPages))assert.ok(nav.includes(`href="${languagePath(language,target)}"`));
    }
    if(page==='home'){
      const journey=['hero','setores','responsabilidades','cobertura-global','demonstracao','servicos-mutual','protecao','infraestrutura-institucional','arquitetura','rede-global','status-operacional','transparencia','mascote-mutucoin','jornada','enterprise-contact','documentos','faq','contato'].map(id=>html.indexOf(`id="${id}"`));
      assert.ok(journey.every((value,i)=>value>=0&&(!i||value>journey[i-1])),'Setores, serviços, alcance, proteção, demonstração, governança e contato');
      assert.equal([...html.matchAll(/class="enterprise-sector content-card"/g)].length,5);
      assert.equal([...html.matchAll(/class="enterprise-service content-card"/g)].length,12);
      assert.equal([...html.matchAll(/role="tab"/g)].length,0);
      assert.equal([...html.matchAll(/class="demo-step"/g)].length,0);
      assert.equal([...html.matchAll(/data-terminal-frame/g)].length,1);
      assert.equal([...html.matchAll(/class="enterprise-rail-list"/g)].length,1);
      assert.ok(html.includes('200+'));
      assert.ok(html.includes('D0')&&html.includes('D1'));
      assert.ok(!/data-count=/.test(html));
      assert.equal([...html.matchAll(/class="story-toggle"/g)].length,2);
    }
    if(page==='ecosystem')assert.equal([...html.matchAll(/class="story-toggle"/g)].length,2);
    if(page==='prices'){
      assert.equal([...html.matchAll(/Powered by TradingView/g)].length,2);
      assert.equal([...html.matchAll(/data-tradingview=/g)].length,2);
    }else assert.ok(!html.includes('data-tradingview='));
    assert.ok(!/(?:action=|data-count=|price\.usd|5,055|5\.055)/.test(html),'Canal ou valor sem aprovação');
    assert.deepEqual([...new Set([...html.matchAll(/href="mailto:([^"]+)"/g)].map(m=>m[1]))],['suporte@mutualcapital.org','contato@mutualcapital.org','juridico@mutualcapital.org'],'Apenas os três e-mails aprovados');
  }
}
for(const [path,html] of all)for(const [,attribute,raw] of html.matchAll(/\b(href|src)="([^"]+)"/g)){
  if(/^(?:https?:|data:|mailto:)/.test(raw))continue;
  const url=new URL(raw,`${origin}${path}`);
  if(url.pathname.endsWith('/')||all.has(url.pathname)){
    assert.ok(all.has(url.pathname),`Página ausente: ${path} → ${raw}`);
    if(url.hash)assert.ok(all.get(url.pathname).includes(`id="${url.hash.slice(1)}"`),`Seção ausente: ${raw}`);
  }else await access(resolve('dist',`.${url.pathname}`));
}
const sitemap=await read('dist/sitemap.xml');
assert.equal([...sitemap.matchAll(/<loc>/g)].length,languages.length*Object.keys(pages).length);
const titles=[...all.values()].map(html=>html.match(/<title[^>]*>(.*?)<\/title>/s)[1]);
const pageCount=Object.keys(pages).length;
for (let i=0;i<languages.length;i++) assert.equal(new Set(titles.slice(i*pageCount,(i+1)*pageCount)).size,pageCount,'Títulos distintos por página');
async function audit(directory){
  for(const entry of await readdir(directory,{withFileTypes:true})){
    if(['node_modules','.git','.planning','dist-public'].includes(entry.name))continue;
    const path=join(directory,entry.name);
    if(entry.isDirectory())await audit(path);
    else if(/\.(html|js|mjs|json|md|css|svg|txt)$/.test(path)){
      const value=await read(path);
      if(!path.startsWith('scripts/')) {
        if(!path.startsWith('src/i18n/')&&!path.startsWith('dist/'))assert.ok(!restricted.test(value),`Termo fora do aviso legal: ${path}`);
        assert.ok(!providerClaim.test(value),`Posicionamento incompatível: ${path}`);
      }
      assert.ok(!/prova de res\u0065rvas/i.test(value),`Termo vedado: ${path}`);
    }
  }
}
await audit('.');
console.log(`Verificado: ${all.size} páginas, sete idiomas completos (${baseline.length} textos cada), navegação, links, ordem da home, animações, metadados, alternativas de idioma, proteção e bloqueio de indexação.`);
