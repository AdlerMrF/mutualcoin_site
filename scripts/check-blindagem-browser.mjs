import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { readFile,writeFile,mkdir } from 'node:fs/promises';
import { resolve,extname } from 'node:path';
import { languages,pages,languagePath,dictionaries,securityHeaders } from '../config/site.js';
import { widths,themes,validateState,createLinkChecker,scrollToFinalState } from './lib/qa-guards.mjs';
import { checkAudienceNavigation, checkCircuitMotion } from './lib/audience-browser.mjs';
const origin='https://mutucoin.local.invalid';
const root=resolve('dist');
const report={estado:'em andamento',navegador:'Google Chrome',movimento:'reduce',fonte:'arquivos gerados; API indisponível simulada e iframe TradingView isolado; não valida serviços externos',esperadas:Object.keys(pages).length*languages.length*widths.length*themes.length,concluidas:0,combinacoes:[],falhas:[]};
const apiOrigin=new URL((await import('../config/leitura-publica.js')).leituraPublica.base).origin;
const types={'.html':'text/html','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml','.webp':'image/webp','.woff2':'font/woff2','.ico':'image/x-icon','.mp4':'video/mp4','.json':'application/json'};
await mkdir('artifacts/blindagem',{recursive:true});
let browser;
try{
  browser=await chromium.launch({channel:'chrome',headless:true});
  report.versao=browser.version();
  const checkLink=createLinkChecker(root,origin);
  for(const width of widths)for(const language of languages)for(const theme of themes){
    const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce',colorScheme:theme==='light'?'dark':'light'});
    await context.addInitScript(value=>{localStorage.setItem('mutucoin-theme',value);},theme);
    await context.route('**/*',async route=>{
      const url=new URL(route.request().url());
      if(url.origin===origin){
        const path=decodeURIComponent(url.pathname);
        const file=resolve(root,`.${path.endsWith('/')?`${path}index.html`:path}`);
        if(!file.startsWith(root+'/'))return route.fulfill({status:403,body:'Caminho recusado'});
        try{return await route.fulfill({status:200,headers:{...securityHeaders(origin,false),'Content-Type':types[extname(file)]||'application/octet-stream'},body:await readFile(file)});}
        catch{return route.fulfill({status:404,body:'Arquivo ausente'});}
      }
      if(url.hostname==='s.tradingview.com')return route.fulfill({contentType:'text/html',body:'<!doctype html><html><head><title>Widget externo isolado no teste</title></head><body></body></html>'});
      if(url.origin===apiOrigin)return route.fulfill({contentType:'application/json',headers:{'Access-Control-Allow-Origin':origin},body:'{"indisponivel":true}'});
      return route.abort('blockedbyclient');
    });
    const page=await context.newPage();
    let errors=[];
    page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
    page.on('pageerror',error=>errors.push(error.message));
    await page.addInitScript(()=>{
      window.qaCsp=[];
      document.addEventListener('securitypolicyviolation',event=>window.qaCsp.push({directive:event.violatedDirective,uri:event.blockedURI}));
    });
    for(const id of Object.keys(pages)){
      errors=[];
      const path=languagePath(language,id);
      const combination={width,language,theme,page:id};
      try{
        const response=await page.goto(origin+path,{waitUntil:'load'});
        assert.ok(response, `Página indisponível: navegação sem resposta em ${path}`);
        assert.equal(response.status(),200);
        await page.waitForFunction(()=>document.documentElement.dataset.animationsReady==='true');
        assert.equal(await page.locator('html').getAttribute('data-theme'),theme);
        assert.equal(await page.locator('html').getAttribute('dir'),language==='ar'?'rtl':'ltr');
        await scrollToFinalState(page);
        if(id==='home'||id.startsWith('case-'))await checkCircuitMotion(page);
        if(id==='prices'){
          const activate=page.locator('.widget-load');await activate.click();
          assert.equal(await page.locator('.widget-slot iframe').count(),2);
          const button=page.locator('#navbar-inner [data-theme-toggle]');
          await button.click();
          for(const frame of await page.locator('.widget-slot iframe').all()){
            const config=JSON.parse(decodeURIComponent(new URL(await frame.getAttribute('src')).hash.slice(1)));
            assert.equal(config.colorTheme,theme==='dark'?'light':'dark');
          }
          await button.click();
          await page.locator('.widget-pause').click();
          await button.click();await button.click();
          assert.equal(await page.locator('[data-tradingview="ticker-tape"] iframe').count(),0,'A troca de tema deve preservar a pausa');
          await scrollToFinalState(page);
        }
        // Axe no estado final, inclusive cabeçalho encolhido. Nenhum bloco próprio é excluído.
        // SerialFrameSelector: primeiro iframe, depois '*' NO documento interno.
        const axe=await new AxeBuilder({page})
          .withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa'])
          .exclude(['iframe[src^="https://s.tradingview.com/"]','*'])
          .analyze();
        const state=await page.evaluate(dictionary=>{
          const visible=el=>el.getClientRects().length>0&&getComputedStyle(el).visibility!=='hidden';
          const keys=[];const untranslated=[];
          for(const el of document.querySelectorAll('*'))for(const attribute of el.attributes){
            if(!/^data-i18n(?:$|-)/.test(attribute.name))continue;
            const key=attribute.value;keys.push(key);
            if(!dictionary[key])continue;
            const value=attribute.name==='data-i18n'?el.textContent:el.getAttribute(attribute.name.slice('data-i18n-'.length));
            const family=key.split('.')[0];
            const allowed=/^(menu|video|market)$/.test(family)?Object.entries(dictionary).filter(([k])=>k.startsWith(family+'.')).map(([,v])=>v):[dictionary[key]];
            if(!allowed.some(text=>String(value).trim()===text.trim()))untranslated.push({key,value});
          }
          const overflow=[...document.querySelectorAll('h1,h2,h3,h4,p,a,summary,button,label,select,#navbar-inner,.contact-panel,.network-counter,.asset-card')].filter(el=>visible(el)&&!el.classList.contains('sr-only')&&el.clientWidth>0&&(el.scrollWidth>el.clientWidth+2||el.getBoundingClientRect().left < -1||el.getBoundingClientRect().right > innerWidth+1)).map(el=>el.id||el.dataset.i18n||el.className);
          return {text:document.body.innerText,translationKeys:keys,untranslated,width:innerWidth,scrollWidth:document.documentElement.scrollWidth,overflow,csp:window.qaCsp,hrefs:[...document.querySelectorAll('a[href]')].map(el=>el.getAttribute('href'))};
        },{...dictionaries[language],'meta.title':id==='home'?dictionaries[language]['home.title']:await page.title(),'meta.description':await page.locator('meta[name="description"]').getAttribute('content')});
        for(const href of state.hrefs)await checkLink(href,path);
        validateState({...state,errors,violations:axe.violations.map(({id,impact,nodes})=>({id,impact,targets:nodes.map(node=>node.target)}))},{...dictionaries[language],'meta.title':'gerado','meta.description':'gerada'});
        report.concluidas++;report.combinacoes.push({...combination,estado:'aprovado'});
      }catch(error){
        report.falhas.push({...combination,erro:String(error)});
        await page.screenshot({path:`artifacts/blindagem/falha-${width}-${language}-${theme}-${id}.png`,fullPage:true}).catch(()=>{});
      }
      if(report.combinacoes.length%50===0)console.log(`Navegador: ${report.concluidas}/${report.esperadas} combinações aprovadas.`);
    }
    // Estados interativos também recebem axe depois da rolagem completa.
    await page.goto(origin+languagePath(language));
    await page.waitForFunction(()=>document.documentElement.dataset.animationsReady==='true');
    await scrollToFinalState(page);
    await page.screenshot({path:`artifacts/blindagem/home-${width}-${language}-${theme}.png`,fullPage:true});
    await page.locator('#navbar-logo').scrollIntoViewIfNeeded();
    for(const button of await page.locator('[data-theme-toggle]:visible').all()){
      await button.click();
      assert.equal(await page.locator('html').getAttribute('data-theme'),theme==='dark'?'light':'dark');
      await button.click();
    }
    if(await page.locator('#mobile-menu-button').isVisible()){
      await page.locator('#mobile-menu-button').click();
      assert.equal(await page.locator('#mobile-menu-button').getAttribute('aria-expanded'),'true');
      await Promise.all([page.waitForEvent('load'),page.locator('#mobile-language-select').selectOption(language)]);
      await page.waitForFunction(()=>document.documentElement.dataset.animationsReady==='true');
      await page.locator('#mobile-menu-button').click();
      const mobileTheme=page.locator('#mobile-menu [data-theme-toggle]');
      await mobileTheme.click();await mobileTheme.click();
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('#mobile-menu-button').getAttribute('aria-expanded'),'false');
    }
    await checkAudienceNavigation(page);
    for (const summary of await page.locator('.faq-item summary').all()) {
      await summary.focus();await page.keyboard.press('Enter');
      assert.equal(await summary.locator('..').getAttribute('open'),'');
    }
    for (const column of await page.locator('.footer-column').all()) await column.evaluate(el=>{el.open=true;});
    for (const tab of await page.locator('.market-tabs [role="tab"]').all()) {
      await tab.focus();await page.keyboard.press('Enter');
      assert.equal(await tab.getAttribute('aria-selected'),'true');
      await scrollToFinalState(page);
      const expanded=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).exclude(['iframe[src^="https://s.tradingview.com/"]','*']).analyze();
      assert.deepEqual(expanded.violations,[],'Axe após abrir FAQ, rodapé e cada aba');
    }
    assert.deepEqual(errors,[],'Console durante interações');
    // Movimento ativo também é exercitado; a matriz principal usa a preferência reduzida.
    if(width===1440){
      await Promise.all([page.waitForEvent('load'),page.emulateMedia({reducedMotion:'no-preference'})]);
      await page.waitForFunction(()=>document.documentElement.dataset.animationsReady==='true');
      await checkCircuitMotion(page,false);
      await page.goto(origin+languagePath(language,'case-trade'));
      await page.waitForFunction(()=>document.documentElement.dataset.animationsReady==='true');
      await checkCircuitMotion(page,false);
      assert.deepEqual(errors,[],'Console com animação ativa');
    }
    await context.close();
  }
  assert.equal(report.concluidas,report.esperadas,'Toda página precisa passar nas 56 combinações');
  assert.deepEqual(report.falhas,[]);
  report.estado='aprovado';
}catch(error){report.estado=browser?'falhou':'impedido pelo ambiente';report.motivo=String(error).split('\n')[0];if(String(error).includes('SIGABRT'))report.detalhe='Chrome encerrado com SIGABRT antes da primeira página.';process.exitCode=1;}
finally{
  await writeFile('artifacts/validacao-blindagem-browser.json',JSON.stringify(report,null,2)+'\n');
  await browser?.close();
  console.log(`Navegador: ${report.estado}; ${report.concluidas}/${report.esperadas} combinações aprovadas.`);
}
