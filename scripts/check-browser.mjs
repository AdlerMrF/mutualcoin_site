// Revisão dos arquivos gerados por interceptação local, sem iniciar servidor.
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { languages, pages, languagePath, securityHeaders } from '../config/site.js';
import { governanceDocuments } from '../config/governance.js';
import { dictionaries } from '../config/site.js';
import { navigationPages } from '../config/routes.js';
const origin='https://mutucoin.local.invalid';
const report={modo:'arquivos interceptados; nenhum servidor',estado:'em andamento',layouts:[],acordeoes:[],acessibilidade:[],erros:[],protecao:[]};
await mkdir('artifacts',{recursive:true});
let browser;
try { browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE||chromium.executablePath(),headless:true}); }
catch(error){
  report.estado='impedido pelo ambiente';
  report.motivo=String(error).split('Call log:')[0];
  await writeFile('artifacts/validacao-navegador.json',JSON.stringify(report,null,2)+'\n');
  console.error('Revisão visual pendente: o ambiente não permitiu abrir o navegador. Nenhum servidor foi iniciado.');
  process.exit(2);
}
const context=await browser.newContext({reducedMotion:'reduce',viewport:{width:1440,height:1000}});
const headers=securityHeaders(origin,false);
const types={'.html':'text/html','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml','.webp':'image/webp','.woff2':'font/woff2','.ico':'image/x-icon','.mp4':'video/mp4'};
await context.route('**/*',async(route)=>{
  const url=new URL(route.request().url());
  if(url.origin!==origin){
    // Estrutura e controles do widget; não valida disponibilidade externa nem preços.
    if(url.hostname==='s.tradingview.com')return route.fulfill({contentType:'text/html',body:'<!doctype html><html><body>Referência externa simulada apenas no teste local.</body></html>'});
    return route.abort();
  }
  let path=decodeURIComponent(url.pathname);if(path.endsWith('/'))path+='index.html';
  const file=resolve('dist',`.${path}`);
  try {await route.fulfill({status:200,headers:{...headers,'Content-Type':types[extname(file)]||'application/octet-stream'},body:await readFile(file)});}
  catch {await route.fulfill({status:404,body:'Arquivo ausente'});}
});
const page=await context.newPage();
const widths=[360,375,390,414,480,640,767,768,820,1023,1024,1280,1439,1440];
async function measureLayout(language,id,estado='inicial') {
  const layout=await page.evaluate(()=>{
    const visible=element=>element.getClientRects().length>0&&getComputedStyle(element).visibility!=='hidden';
    const label=element=>element.dataset.i18n||element.id||element.className||element.tagName;
    const overlaps=[];
    // Compara irmãos, sem confundir um bloco com o texto contido nele.
    for(const container of document.querySelectorAll('main,.hero-layout,.hero-copy,.b-grid,.ecosystem-intro,.editorial-layout,.chain-layout,.network-grid,.footer-layout,#navbar-inner,#navbar-inner > div,.hero-ctas,.hero-chips,.download-list li,.download-list li > div,.chain-params,.footer-nav nav,.story-frame,.chain-reading,.chain-reading .section-heading,.purpose-blocks,.purpose-block,.purpose-notary,.purpose-contact,.network-counters,.market-bento,.asset-columns,.asset-card')) {
      const children=[...container.children].filter(visible).map(element=>({element,rect:element.getBoundingClientRect()})).filter(({rect})=>rect.width>0&&rect.height>0);
      for(let i=0;i<children.length;i++)for(let j=i+1;j<children.length;j++){
        const a=children[i],b=children[j];
        if(Math.min(a.rect.right,b.rect.right)-Math.max(a.rect.left,b.rect.left)>1&&Math.min(a.rect.bottom,b.rect.bottom)-Math.max(a.rect.top,b.rect.top)>1)overlaps.push(`${label(container)}: ${label(a.element)} / ${label(b.element)}`);
      }
    }
    return {
      largura:innerWidth,
      excesso:document.documentElement.scrollWidth>innerWidth+1,
      cortados:[...document.querySelectorAll('h1,h2,h3,h4,p,summary,.hero-chip,#navbar-inner')].filter(element=>visible(element)&&element.getBoundingClientRect().width>0&&element.scrollWidth>element.clientWidth+2).map(label),
      blocosSobrepostos:overlaps,
      sobrepostos:[...document.querySelectorAll('.story-figure')].filter(figure=>{
        const video=figure.querySelector('video').getBoundingClientRect();
        const frame=figure.querySelector('.story-frame').getBoundingClientRect();
        const control=figure.querySelector('.story-toggle').getBoundingClientRect();
        const caption=figure.querySelector('figcaption').getBoundingClientRect();
        return video.bottom>control.top+1||control.bottom>frame.bottom||caption.top<frame.bottom||video.left<frame.left||video.right>frame.right;
      }).length,
    };
  });
  report.layouts.push({language,pagina:id,estado,...layout});
  assert.ok(!layout.excesso&&!layout.cortados.length&&!layout.sobrepostos&&!layout.blocosSobrepostos.length,`Conteúdo cortado ou sobreposto: ${language}/${id}/${layout.largura}/${estado}: ${JSON.stringify(layout)}`);
}
page.on('pageerror',error=>report.erros.push(String(error)));
page.on('console',message=>{if(message.type()==='error')report.erros.push(message.text());});
await page.addInitScript(()=>{
  window.siteCsp=[];
  document.addEventListener('securitypolicyviolation',event=>window.siteCsp.push({diretiva:event.violatedDirective,destino:event.blockedURI}));
});
try{
for(const language of languages)for(const id of Object.keys(pages)){
  await page.goto(origin+languagePath(language,id),{waitUntil:'load'});
  await page.waitForFunction(()=>document.documentElement.dataset.animationsReady==='true');
  await page.evaluate(()=>document.fonts.ready);
  for(const width of widths){
    await page.setViewportSize({width,height:1000});
    await measureLayout(language,id);
  }
  if(id==='governance'){
    const items=page.locator('.governance-list > li');
    assert.equal(await items.count(),governanceDocuments.length);
    for(let i=0;i<governanceDocuments.length;i++){
      const document=governanceDocuments[i],item=items.nth(i);
      assert.equal(await item.getAttribute('data-document-id'),document.id);
      assert.equal((await item.locator('h2').textContent()).trim(),`${document.nome[language]} — ${document.codigo} · v${document.versao}`);
      if(document.estado==='em_elaboracao'){
        assert.equal(await item.locator('a,[href]').count(),0);
        assert.equal(await item.locator('button').isDisabled(),true);
        assert.equal(await item.locator('.document-status').textContent(),dictionaries[language]['governance.draft']);
        assert.equal(await item.locator('.document-note').textContent(),dictionaries[language]['governance.note']);
      }
    }
  }
  const groups=page.locator('.network-group');
  if(await groups.count()) {
    for(const group of await groups.all()) {
      const summary=group.locator('summary');
      const initiallyOpen=await group.evaluate(element=>element.open);
      await summary.focus();await page.keyboard.press('Enter');
      assert.equal(await group.evaluate(element=>element.open),!initiallyOpen);
      await page.keyboard.press('Space');
      assert.equal(await group.evaluate(element=>element.open),initiallyOpen);
      if(!initiallyOpen)await summary.click();
      assert.equal(await group.locator('a:visible').count(),7);
    }
    for(const width of widths){await page.setViewportSize({width,height:1000});await measureLayout(language,id,'grupos abertos');}
    report.acordeoes.push({language,pagina:id,grupos:await groups.count(),teclado:true,links:await groups.locator('a:visible').count()});
  }
  await page.setViewportSize({width:360,height:1000});
  await page.locator('#mobile-menu-button').click();
  assert.equal(await page.locator('#mobile-menu-button').getAttribute('aria-expanded'),'true');
  assert.equal(await page.locator('#mobile-menu a:visible').count(),Object.keys(navigationPages).length);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#mobile-menu-button').getAttribute('aria-expanded'),'false');
  assert.equal(await page.locator('#mobile-menu').isVisible(),false);
  if(id==='home'){
    // As chamadas externas são bloqueadas neste teste: ausência nunca vira zero.
    await page.locator('[data-home-readings]').scrollIntoViewIfNeeded();
    await page.waitForFunction(()=>document.documentElement.dataset.homeReadingsReady==='true');
    assert.deepEqual(await page.locator('[data-counter-value]').allTextContents(),['—','—','—']);
    assert.deepEqual(await page.locator('[data-counter-status]').allTextContents(),Array(3).fill(dictionaries[language]['status.deployment']));
    assert.ok((await page.locator('[data-mtc-price]').allTextContents()).every(value=>value==='—'));
    assert.equal(await page.locator('.asset-motion-toggle').isVisible(),false,'Movimento reduzido: controle desnecessário');
    assert.equal(await page.locator('.asset-copy:visible').count(),0,'Movimento reduzido: cópias visíveis');
    assert.ok(await page.locator('.asset-track').evaluateAll(tracks=>tracks.every(track=>getComputedStyle(track).animationName==='none'&&getComputedStyle(track).transform==='none')));
    const button=page.locator('.story-toggle').first();
    const video=page.locator('video').first();
    await video.scrollIntoViewIfNeeded();
    await page.waitForFunction(()=>document.querySelector('video').readyState>=2);
    assert.equal(await video.evaluate(video=>video.paused&&video.currentTime===0),true,'Movimento reduzido: início automático');
    assert.equal(await button.getAttribute('aria-pressed'),'true');
    await button.click();await page.waitForFunction(()=>document.querySelector('video').currentTime>0);
    assert.equal(await button.getAttribute('aria-pressed'),'false');
    await button.click();await page.waitForFunction(()=>document.querySelector('video').paused);
    assert.equal(await button.getAttribute('aria-pressed'),'true');
  }
  if(!process.argv.includes('--quick')){
    const results=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
    report.acessibilidade.push({language,pagina:id,problemas:results.violations.map(v=>({id:v.id,impacto:v.impact,alvos:v.nodes.map(n=>n.target)}))});
    assert.equal(results.violations.length,0,`Acessibilidade: ${language}/${id}`);
  }
  report.protecao.push(...await page.evaluate(()=>window.siteCsp));
}
// Decodificação e avanço real dos três MP4, entrada/saída da tela e pausa manual.
const playback=await context.newPage();
await playback.emulateMedia({reducedMotion:'no-preference'});
for(const id of ['home','ecosystem']){
  await playback.goto(origin+languagePath('pt-BR',id));
  await playback.waitForFunction(()=>document.documentElement.dataset.videosReady==='true');
  for(const video of await playback.locator('video').all()){
    await video.scrollIntoViewIfNeeded();
    await playback.waitForFunction(src=>[...document.querySelectorAll('video')].some(v=>v.currentSrc===src&&!v.paused&&v.currentTime>0),await video.evaluate(v=>v.querySelector('source').src));
    assert.equal(await playback.locator('video').evaluateAll(videos=>videos.filter(v=>!v.paused).length),1,'Animações concorrentes');
    assert.equal(await video.evaluate(v=>v.videoWidth>0&&v.videoHeight>0&&v.muted&&v.loop&&v.playsInline),true,'Vídeo não decodificado');
    const button=video.locator('..').locator('.story-toggle');
    await button.click();assert.equal(await video.evaluate(v=>v.paused),true);
    await playback.locator('footer').scrollIntoViewIfNeeded();
    await video.scrollIntoViewIfNeeded();
    assert.equal(await video.evaluate(v=>v.paused),true,'Pausa manual preservada');
    await button.click();await playback.waitForFunction(src=>[...document.querySelectorAll('video')].some(v=>v.currentSrc===src&&!v.paused),await video.evaluate(v=>v.currentSrc));
    await playback.locator('footer').scrollIntoViewIfNeeded();
    await playback.waitForFunction(()=>[...document.querySelectorAll('video')].every(v=>v.paused));
  }
}
await playback.close();
// O seletor preserva a página corrente, inclusive ao ir para e sair do árabe.
for(const from of languages){
  await page.goto(origin+languagePath(from,'governance'));
  for(const target of languages){
    await page.selectOption('#language-select',target);
    await page.waitForURL(origin+languagePath(target,'governance'));
    assert.equal(await page.locator('html').getAttribute('lang'),target);
    assert.equal(await page.locator('html').getAttribute('dir'),target==='ar'?'rtl':'ltr');
  }
}
for(const from of languages){
  await page.goto(origin+languagePath(from,'wallets'));
  for(const target of languages){
    await page.selectOption('#language-select',target);
    await page.waitForURL(origin+languagePath(target,'wallets'));
    assert.equal(await page.locator('html').getAttribute('lang'),target);
  }
}
await page.goto(origin+languagePath('pt-BR','prices'));
await page.locator('#market').scrollIntoViewIfNeeded();
await page.locator('.widget-load').click();
assert.equal(await page.locator('[data-tradingview="ticker-tape"] iframe').count(),1);
await page.locator('.widget-pause').click();
assert.equal(await page.locator('[data-tradingview="ticker-tape"] iframe').count(),0);
await page.locator('.widget-pause').click();
assert.equal(await page.locator('[data-tradingview="ticker-tape"] iframe').count(),1);
for(const [language,width] of [['pt-BR',1440],['pt-BR',360],['ar',360],['ja',1440]]){
  await page.setViewportSize({width,height:1000});await page.goto(origin+languagePath(language));
  await page.waitForFunction(()=>document.documentElement.dataset.animationsReady==='true');
  await page.screenshot({path:`artifacts/home-${language}-${width}.png`,fullPage:true});
}
assert.equal(report.erros.length,0,'Erros de execução');
assert.equal(report.protecao.length,0,'Bloqueios de segurança');
report.estado='concluído';
}catch(error){report.estado='falhou';report.motivo=String(error);process.exitCode=1;}
finally{
 await writeFile('artifacts/validacao-navegador.json',JSON.stringify(report,null,2)+'\n');
 await browser.close();
 console.log(`Revisão de navegador: ${report.estado}; ${report.layouts.length} verificações de tela. Os dados externos do widget são simulados no teste.`);
}
