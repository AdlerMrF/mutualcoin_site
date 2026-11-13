import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { plataforma, platformPage } from '../config/plataforma.js';
import { languages, dictionaries, languagePath, escapeHTML, renderHTML } from '../config/site.js';
import { pages, resolvePath } from '../config/routes.js';
import { parseMapa } from './lib/mapa-plataforma.mjs';
import { initI18n } from '../src/i18n/index.js';
import { audiences, catalogue, useCases, homeSectionsByAudience } from '../config/audiences.js';

const snapshot = JSON.parse(await readFile(new URL('../config/mapa-plataforma.json', import.meta.url), 'utf8'));
let mapa = snapshot;
try {
  mapa = parseMapa(await readFile(new URL('../../mutucoin-api-mapa.md', import.meta.url), 'utf8'));
  assert.deepEqual(snapshot, mapa, 'A cópia do inventário precisa acompanhar o mapa original.');
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
  console.log('Mapa externo ausente; usando a cópia do inventário gerada a partir dele.');
}

function checkInventory(items, inventory = mapa) {
  assert.ok(items.length >= inventory.modulos.length + inventory.extras.length, 'Lista de telas incompleta.');
  assert.equal(inventory.abas.length + inventory.rotas.length, 21, 'O mapa deve cobrir as 21 rotas/abas atuais.');
  assert.equal(inventory.modulos.length, 14, 'O mapa deve conter os 14 módulos.');
  assert.equal(new Set(items.map(item => item.id)).size, items.length, 'Identificador de tela repetido.');
  assert.equal(new Set(items.map(item => item.rota)).size, items.length, 'Rota de tela repetida.');
  const availableEndpoints = new Set(inventory.endpoints);
  for (const item of items) {
    assert.match(item.id, /^[a-z][a-z0-9-]*$/);
    assert.match(item.rota, /^\/app\/[a-z][a-z0-9-]*\/$/);
    assert.equal(item.estado, 'em_implantacao', `Estado incorreto: ${item.id}`);
    assert.equal(typeof item.move_valor, 'boolean', `Falta move_valor: ${item.id}`);
    assert.equal(typeof item.operacao_financeira, 'boolean');
    assert.ok(item.origem && Array.isArray(item.origem.rotas) && Array.isArray(item.origem.itens_mapa));
    assert.ok(item.origem.aba || item.origem.rotas.length || item.origem.itens_mapa.length || item.modulo, `Origem ausente: ${item.id}`);
    for (const field of ['nome', 'descricao']) {
      assert.deepEqual(Object.keys(item[field]).sort(), [...languages].sort(), `Idiomas incompletos: ${item.id}/${field}`);
      for (const language of languages) assert.ok(item[field][language]?.trim(), `Texto vazio: ${item.id}/${language}/${field}`);
    }
    assert.ok(Array.isArray(item.endpoints));
    for (const endpoint of item.endpoints) assert.ok(availableEndpoints.has(endpoint), `Endpoint fora do mapa: ${item.id}/${endpoint}`);
  }
  for (const aba of inventory.abas) {
    const item = items.find(candidate => candidate.origem.aba === aba.id && !candidate.origem.itens_mapa.length);
    assert.ok(item, `Aba sem tela: ${aba.id}`);
    assert.equal(item.nome['pt-BR'], aba.nome, `Nome da aba atual alterado: ${aba.id}`);
    assert.equal(item.move_valor, aba.move_valor, `Classificação de movimentação diferente do mapa: ${aba.id}`);
  }
  for (const rota of inventory.rotas) assert.ok(items.some(item => item.origem.rotas.includes(rota)), `Rota atual sem tela: ${rota}`);
  for (const modulo of inventory.modulos) {
    assert.ok(items.some(item => item.modulo === modulo.nome && item.nome['pt-BR'] === modulo.nome), `Módulo sem tela: ${modulo.nome}`);
    for (const aba of modulo.abas) assert.ok(items.some(item => item.origem.aba === aba), `Aba de módulo ausente: ${aba}`);
  }
  for (const extra of inventory.extras) assert.ok(items.some(item => item.origem.itens_mapa.includes(extra.id)), `Função adicional sem tela: ${extra.id}/${extra.nome}`);
  // Os itens compostos do mapa precisam manter cada função identificável no menu.
  for (const [extra, expected] of [[5,['Webhooks','API Keys']],[7,['Auditoria','Saúde']],[11,['Documentação da API','Referência da API','Guias de integração','Resumo para LLMs']],[12,['Faixa de status das redes','Fatos da rede']]]) {
    for (const name of expected) assert.ok(items.some(item => item.origem.itens_mapa.includes(extra) && item.nome['pt-BR'] === name), `Função adicional sem tela própria: ${name}`);
  }
  const referenced = new Set(items.flatMap(item => item.endpoints));
  for (const endpoint of inventory.endpoints) assert.ok(referenced.has(endpoint), `Endpoint do mapa sem referência: ${endpoint}`);
  assert.deepEqual(items.find(item => item.id === 'faucet')?.redes, ['mutucoin-testnet'], 'Faucet deve oferecer somente testnet.');
}

function attributes(tag) {
  return Object.fromEntries([...tag.matchAll(/([^\s=<>/'"]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)]
    .map(([, name, double, single, bare]) => [name.toLowerCase(), double ?? single ?? bare ?? '']));
}
function checkScreenActions(html, item) {
  const screen = html.match(/<article\b[^>]*data-platform-screen=["'][^"']+["'][^>]*>[\s\S]*?<\/article>/i)?.[0];
  assert.ok(screen, `Tela de módulo ausente: ${item.id}`);
  assert.ok(screen.includes(`data-platform-screen="${item.id}"`), `Tela trocada: ${item.id}`);
  // Confere também elementos colocados ao lado do artigo. Só a navegação local é permitida.
  const main = html.match(/<main\b[^>]*>[\s\S]*?<\/main>/i)?.[0] ?? html;
  const scope = main.replace(/<nav class="app-navigation"[^>]*>[\s\S]*?<\/nav>/i, '');
  for (const [tag, name] of scope.matchAll(/<([a-z][\w:-]*)\b[^>]*>/gi)) {
    const attrs = attributes(tag);
    const has = key => Object.hasOwn(attrs, key);
    const disabledControl = has('disabled') && /^(?:button|input|select|textarea|option|optgroup|fieldset)$/i.test(name);
    const active = /^(?:button|input|select|textarea)$/i.test(name) && !disabledControl;
    const link = /^(?:a|area)$/i.test(name) && (has('href') || has('xlink:href'));
    const behavior = Object.keys(attrs).some(key => /^on/i.test(key)) || (has('contenteditable') && attrs.contenteditable !== 'false')
      || has('formaction') || /^(?:form|iframe|object|embed|script|summary)$/i.test(name)
      || (['button','link','textbox','combobox','switch','checkbox','radio','slider'].includes(attrs.role) && !disabledControl);
    assert.ok(!active && !link && !behavior, `${item.move_valor ? 'Ação habilitada em módulo que move valor' : 'Ação indevida no esqueleto'}: ${item.id}/${name}`);
  }
  return screen;
}

checkInventory(plataforma);
const template = await readFile('index.html','utf8');
let screens = 0;
for (const language of languages) {
  const services = await readFile(`dist${languagePath(language,'services')}index.html`, 'utf8');
  const home = await readFile(`dist${languagePath(language)}index.html`, 'utf8');
  assert.ok(home.includes(`href="${languagePath(language,'services')}"`), 'Chamada de Serviços ausente na home.');
  assert.equal([...services.matchAll(/data-service-id=/g)].length, plataforma.length, 'Serviços incompletos.');
  for (const item of plataforma) {
    assert.ok(services.includes(`data-service-id="${item.id}"`));
    const page = platformPage(item), path = languagePath(language,page);
    assert.equal(pages[page],item.rota.slice(1,-1));
    assert.deepEqual(resolvePath(path),{ language, page });
    assert.deepEqual(resolvePath(path.slice(0,-1)),{ language, page });
    assert.deepEqual(resolvePath(`${path}index.html`),{ language, page });
    const html = await readFile(`dist${path}index.html`,'utf8');
    screens++;
    const screen = checkScreenActions(html,item);
    assert.equal(screen,checkScreenActions(renderHTML(template,language,'https://mutucoin.local.invalid',page),item), `Tela gerada diverge da configuração: ${path}`);
    for (const value of [item.nome[language],item.descricao[language],dictionaries[language]['status.deployment']]) assert.ok(screen.includes(escapeHTML(value)), `Texto da tela ausente: ${language}/${item.id}`);
    assert.ok(screen.includes('data-state="em_implantacao"'));
    if (item.move_valor) assert.ok(screen.includes(escapeHTML(dictionaries[language]['app.disabled'])), `Aviso de operação desligada ausente: ${language}/${item.id}`);
    if (item.operacao_financeira) assert.ok(screen.includes(escapeHTML(dictionaries[language]['app.partner'])), `Parceiro licenciado ausente: ${language}/${item.id}`);
    if (item.id === 'faucet') {
      assert.ok(screen.includes(escapeHTML(dictionaries[language]['app.testnet'])));
      assert.ok(!/mainnet|28001|mutucoin\/(?:faucet|dispense)/i.test(screen), `Mainnet oferecida no Faucet: ${language}`);
    }
    const menu = html.match(/<nav class="app-navigation"[\s\S]*?<\/nav>/)?.[0];
    assert.ok(menu);
    assert.equal([...menu.matchAll(/data-module-link=/g)].length,plataforma.length,'Menu incompleto.');
    for (const target of plataforma) assert.ok(menu.includes(`href="${languagePath(language,platformPage(target))}"`), `Item de menu ausente: ${target.id}`);
  }
}
assert.equal(screens,plataforma.length*languages.length);
// Executa o seletor real com a página e a localização simuladas, sem abrir rede.
const originalDocument=globalThis.document, originalLocation=globalThis.location;
let languageChanges=0;
try {
  for (const page of Object.keys(pages)) for (const from of languages) for (const target of languages) {
    let change, destination;
    const selector={value:'',addEventListener:(name,handler)=>{ assert.equal(name,'change'); change=handler; }};
    globalThis.document={documentElement:{lang:from},getElementById:id=>id==='runtime-copy'?{textContent:'{}'}:selector,querySelectorAll:query=>{assert.equal(query,'#language-select, [data-language-select]');return [selector];}};
    globalThis.location={href:`https://mutucoin.local.invalid${languagePath(from,page)}?preview=1#main-content`,assign:href=>{destination=new URL(href);},replace:href=>{destination=new URL(href);}};
    initI18n();
    assert.equal(selector.value,from);
    selector.value=target;
    change();
    assert.equal(destination.pathname,languagePath(target,page));
    assert.equal(destination.search,'?preview=1');
    assert.equal(destination.hash,'#main-content');
    globalThis.location.href=`https://mutucoin.local.invalid${languagePath(from,page)}?lang=${target}&preview=1#main-content`;
    initI18n();
    assert.equal(destination.pathname,languagePath(target,page));
    assert.equal(destination.search,'?preview=1');
    assert.equal(destination.hash,'#main-content');
    languageChanges++;
  }
} finally {
  if (originalDocument===undefined) delete globalThis.document; else globalThis.document=originalDocument;
  if (originalLocation===undefined) delete globalThis.location; else globalThis.location=originalLocation;
}
assert.equal(languageChanges,Object.keys(pages).length*languages.length**2);
// Novas portas têm destinos reais e preservam o acesso aos módulos anteriores.
for (const language of languages) {
  for (const audience of audiences) {
    const html=await readFile(`dist${languagePath(language,audience.id)}index.html`,'utf8');
    for(const item of audience.items)assert.ok(html.includes(`href="${languagePath(language,item.page)}${item.hash?`#${item.hash}`:''}"`));
    for(const page of audience.extra)assert.ok(html.includes(`href="${languagePath(language,page)}"`));
    for(const [hash] of homeSectionsByAudience[audience.id])assert.ok(html.includes(`href="${languagePath(language)}#${hash}"`));
  }
  const services=await readFile(`dist${languagePath(language,'services')}index.html`,'utf8');
  for(const service of catalogue){
    assert.ok(services.includes(`data-catalogue-service="${service.id}"`));
    const html=await readFile(`dist${languagePath(language,service.page)}index.html`,'utf8');
    assert.ok(html.includes('id="em-breve"'));
    assert.ok(html.includes(`href="${languagePath(language,service.module)}"`));
  }
  for(const useCase of useCases){
    const html=await readFile(`dist${languagePath(language,useCase.page)}index.html`,'utf8');
    const order=['desafio','fluxo','recursos','para-quem','security','fale-com-especialista'].map(id=>html.indexOf(`id="${id}"`));
    assert.ok(order.every((position,i)=>position>=0&&(!i||position>order[i-1])));
  }
}
// O código executado pelo navegador não contém meios de operar, gerar chaves ou guardar dados.
async function browserSources(directory) {
  const paths=[];
  for (const entry of await readdir(directory,{withFileTypes:true})) {
    const file=join(directory,entry.name);
    if (entry.isDirectory()) paths.push(...await browserSources(file));
    else if (entry.name.endsWith('.js')) paths.push(file);
  }
  return paths;
}
for (const file of ['index.js',...await browserSources('src')]) {
  const source=await readFile(file,'utf8');
  if (file !== 'src/plataforma/leitura.js') assert.ok(!/\bfetch\b/.test(source), `Consulta fora do adaptador único: ${file}`);
  // Exceção solicitada: uma única gravação da preferência visual; todo o resto segue proibido.
  const checked = file === 'src/theme.js' ? source.replace("localStorage.setItem('mutucoin-theme', root.dataset.theme)", '') : source;
  assert.ok(!/\b(?:XMLHttpRequest|WebSocket|EventSource|sendBeacon|localStorage|sessionStorage|indexedDB|generateKey|generateKeyPair|ethers|ethereum)\b/.test(checked), `Capacidade operacional ou armazenamento no navegador: ${file}`);
}
// Provas negativas em memória: a verificação deve detectar as regressões reais.
const without = predicate => plataforma.filter(item => !predicate(item));
assert.throws(()=>checkInventory(without(item=>item.origem.aba==='wallet')),/Aba sem tela: wallet/);
assert.throws(()=>checkInventory(without(item=>item.modulo==='Carteira Multi-rede')),/Módulo sem tela/);
assert.throws(()=>checkInventory(without(item=>item.origem.rotas.includes('/docs'))),/Rota atual sem tela/);
assert.throws(()=>checkInventory(without(item=>item.origem.itens_mapa.includes(3))),/Função adicional sem tela/);
assert.throws(()=>checkInventory(without(item=>item.id==='api-keys')),/Função adicional sem tela própria/);
assert.throws(()=>checkInventory(plataforma.map(item=>item.id==='hub'?{...item,move_valor:false}:item)),/Classificação de movimentação/);
assert.throws(()=>checkInventory(plataforma.map(item=>item.id==='faucet'?{...item,redes:['mutucoin','mutucoin-testnet']}:item)),/somente testnet/);
const financial=plataforma.find(item=>item.id==='hub');
const wrap = inner => `<article data-platform-screen="hub">${inner}</article>`;
for (const action of ['<button>Enviar</button>',"<input type='submit'>",'<select></select>','<a href="/api/hub">Sacar</a>',"<button data-disabled='true'>Trocar</button>",'<a href="/api/hub" aria-disabled="true">Sacar</a>','<div role=button>Enviar</div>','<form></form>','<span onclick="operar()">Enviar</span>','<textarea></textarea>']) {
  assert.throws(()=>checkScreenActions(wrap(action),financial),/Ação habilitada em módulo que move valor/);
}
checkScreenActions(wrap('<button disabled>Enviar</button>'),financial);
assert.throws(()=>checkScreenActions(`<main>${wrap('')}<button>Sacar</button></main>`,financial),/Ação habilitada em módulo que move valor/);
console.log(`Cobertura verificada: 21 rotas/abas, 14 módulos, 12 itens adicionais; ${plataforma.length} áreas × ${languages.length} idiomas = ${screens} telas; ${languageChanges} combinações de troca de idioma; ações bloqueadas e Faucet só testnet. Regressões simuladas detectadas.`);
