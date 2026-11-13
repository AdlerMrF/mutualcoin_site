import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve, sep } from 'node:path';
export const widths = [360,768,1024,1440];
export const themes = ['light','dark'];
export function validateState(state, dictionary) {
  assert.deepEqual(state.errors, [], 'Erro de console ou execução');
  assert.deepEqual(state.csp, [], 'Bloqueio pela política de segurança');
  assert.ok(!/(?:\bundefined\b|\bNaN\b|\{\{[^}]+\}\})/.test(state.text), 'Texto cru ou marcador não resolvido');
  assert.ok(!/\b(?:catalog|audience|partners|case|safety|orchestration|features|band|mega|shield|motion|nav|footer|theme|video|market|status|reading|platform|app|hero|position|language)\.[a-zA-Z0-9_.-]+/.test(state.text), 'Chave de tradução exibida como texto');
  for (const key of state.translationKeys) assert.ok(typeof dictionary[key]==='string' && dictionary[key].trim(), `Chave de tradução ausente: ${key}`);
  assert.deepEqual(state.untranslated, [], 'Tradução ausente no conteúdo ou atributo');
  assert.ok(state.scrollWidth <= state.width + 1, 'Página mais larga que a tela');
  assert.deepEqual(state.overflow, [], 'Texto ou controle cortado');
  assert.deepEqual(state.violations, [], 'Violação do axe');
}
export function createLinkChecker(root, origin) {
  const cache = new Map();
  async function read(file) {
    if (!cache.has(file)) cache.set(file,readFile(file,'utf8'));
    return cache.get(file);
  }
  return async (href, from) => {
    const url = new URL(href, new URL(from,origin));
    if (url.origin !== origin || !/^https?:$/.test(url.protocol)) return;
    const decoded=decodeURIComponent(url.pathname);
    const file=resolve(root,`.${decoded.endsWith('/') ? `${decoded}index.html` : decoded}`);
    assert.ok(file.startsWith(`${resolve(root)}${sep}`),'Link fora da pasta do site');
    let content;
    try {content=await read(file);} catch {assert.fail(`Link interno quebrado: ${from} → ${href}`);}
    if(url.hash){
      const id=decodeURIComponent(url.hash.slice(1));
      assert.ok(content.includes(`id="${id}"`),`Seção ausente: ${from} → ${href}`);
    }
  };
}
// Rola incrementalmente até o fim real: ativa carregamento e observadores de todas as seções.
export async function scrollToFinalState(page) {
  await page.evaluate(async () => {
    window.scrollTo(0,0);
    for(let y=0;y<document.documentElement.scrollHeight;y+=Math.max(200,innerHeight*.75)){
      window.scrollTo(0,y);
      await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
    }
    window.scrollTo(0,document.documentElement.scrollHeight);
    await document.fonts.ready;
    await Promise.all([...document.images].map(img=>img.decode().catch(()=>{})));
    await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  });
  await page.waitForFunction(() => !document.querySelector('[data-home-readings]') || document.documentElement.dataset.homeReadingsReady==='true');
  await page.waitForFunction(() => [...document.querySelectorAll('[data-mascote]')].every(figure=>figure.dataset.loaded==='true'));
}
