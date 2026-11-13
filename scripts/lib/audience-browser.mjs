import assert from 'node:assert/strict';
import AxeBuilder from '@axe-core/playwright';

export async function checkAudienceNavigation(page){
  const mobile=await page.locator('#mobile-menu-button').isVisible();
  if(mobile)await page.locator('#mobile-menu-button').click();
  const scope=page.locator(mobile?'.audience-mobile-navigation':'.audience-navigation');
  const triggers=scope.locator('.audience-trigger');
  assert.equal(await triggers.count(),4);
  for(const trigger of await triggers.all()){
    await trigger.scrollIntoViewIfNeeded();
    await trigger.focus();await page.keyboard.press('Enter');
    assert.equal(await trigger.getAttribute('aria-expanded'),'true');
    const panel=page.locator('#'+await trigger.getAttribute('aria-controls'));
    assert.ok(await panel.isVisible());
    const state=await panel.evaluate(root=>{
      const visible=[...root.querySelectorAll('a[href],button,summary,select')].filter(e=>e.getClientRects().length&&getComputedStyle(e).visibility!=='hidden');
      return {first:document.activeElement===visible[0],columns:getComputedStyle(root).gridTemplateColumns.split(' ').length,clipped:root.scrollWidth>root.clientWidth+1};
    });
    assert.ok(state.first,'Abertura por teclado leva o foco para o painel');
    assert.equal(state.columns,mobile?1:2,'Duas colunas no computador e acordeão no celular');
    assert.ok(!state.clipped,'Painel sem corte horizontal');
    await page.keyboard.press('Shift+Tab');
    assert.ok(await panel.locator('[data-close-door]').evaluate(el=>document.activeElement===el),'Foco volta ao último controle');
    await page.keyboard.press('Tab');
    assert.ok(await panel.locator('.mega-portal').evaluate(el=>document.activeElement===el),'Foco volta ao primeiro controle');
    const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).analyze();
    assert.deepEqual(axe.violations,[],'Acessibilidade com cada porta aberta');
    await page.keyboard.press('Escape');
    assert.equal(await trigger.getAttribute('aria-expanded'),'false');
    assert.ok(await trigger.evaluate(el=>document.activeElement===el),'Esc devolve o foco ao botão correto');
    if(!mobile){
      await trigger.hover();assert.equal(await trigger.getAttribute('aria-expanded'),'true');
      await trigger.click();assert.equal(await trigger.getAttribute('aria-expanded'),'true','Clique depois do hover preserva a abertura');
      await page.keyboard.press('Escape');
    }
  }
  if(mobile){
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#mobile-menu-button').getAttribute('aria-expanded'),'false');
  }
}

export async function checkCircuitMotion(page,reduced=true){
  for(const figure of await page.locator('[data-circuit-motion]').all()){
    await figure.scrollIntoViewIfNeeded();
    const button=figure.locator('.circuit-toggle');
    if(reduced){
      assert.equal(await figure.getAttribute('data-playing'),'false');
      assert.ok(await figure.locator('.circuit-pulse,.flow-node,.demo-step').first().evaluate(el=>getComputedStyle(el).animationName==='none'));
      await button.click();assert.equal(await figure.getAttribute('data-playing'),'false','Preferência reduzida prevalece');
      await button.click();
    }else{
      await figure.page().waitForFunction(el=>el.dataset.playing==='true',await figure.elementHandle());
      await button.click();assert.equal(await figure.getAttribute('data-playing'),'false');
      await button.click();assert.equal(await figure.getAttribute('data-playing'),'true');
    }
  }
}
