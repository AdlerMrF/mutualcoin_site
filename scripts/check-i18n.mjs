// Falha se algum idioma não tiver todas as chaves com valor, ou se o site usar chave que não existe em pt-BR.
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { languages, pages, dictionaries, renderHTML } from '../config/site.js';
import { validateGovernanceDocuments } from '../config/governance.js';
import { audiences, catalogue, useCases } from '../config/audiences.js';

validateGovernanceDocuments();
for (const page of [...audiences.map(a=>a.id),...catalogue.map(s=>s.page),...useCases.map(c=>c.page)]) {
  assert.ok(Object.hasOwn(pages,page),`Nova página sem rota: ${page}`);
  for(const language of languages)for(const key of [`nav.${page}`,`${page}.title`,`${page}.desc`])assert.ok(dictionaries[language][key]?.trim(),`Página sem tradução: ${language}/${key}`);
}

const baseline = Object.keys(dictionaries['pt-BR']).sort();
const falhas = [];
for (const language of languages) {
  const d = dictionaries[language];
  for (const key of baseline) if (typeof d[key] !== 'string' || !d[key].trim()) falhas.push(`${language}: sem valor para ${key}`);
  for (const key of Object.keys(d)) if (!(key in dictionaries['pt-BR'])) falhas.push(`${language}: chave sem par em pt-BR ${key}`);
}
const fontes = ['index.html', ...(await readdir('config')).filter((f) => f.endsWith('.js')).map((f) => `config/${f}`)];
for (const file of fontes) {
  const text = await readFile(file, 'utf8');
  for (const [, key] of text.matchAll(/data-i18n(?:-[\w-]+)?="([\w.-]+)"/g)) if (!key.startsWith('meta.') && !(key in dictionaries['pt-BR'])) falhas.push(`${file}: chave usada sem tradução ${key}`);
}
// Chaves montadas no código só aparecem renderizando: toda página, em todo idioma, sem erro nem recurso ao pt-BR.
const template = await readFile('index.html', 'utf8');
const warn = console.warn;
console.warn = (message) => falhas.push(String(message));
for (const language of languages) for (const page of Object.keys(pages)) {
  try { renderHTML(template, language, 'https://mutucoin.local.invalid', page); } catch (error) { falhas.push(`${language}/${page}: ${error.message}`); }
}
console.warn = warn;
assert.deepEqual(falhas, [], `Traduções com falha:\n${falhas.join('\n')}`);
console.log(`i18n ok: ${baseline.length} chaves × ${languages.length} idiomas`);
