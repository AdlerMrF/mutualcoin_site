import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { governanceDocuments, publishedFile, validateGovernanceDocuments } from '../config/governance.js';
import { renderGovernanceDocuments } from '../config/governance-page.js';
import { dictionaries, languages, languagePath } from '../config/site.js';
import { audiences, catalogue, useCases, paymentRails } from '../config/audiences.js';

validateGovernanceDocuments();
// Numeração própria da Mutual: documento inédito começa em v1.0.
assert.deepEqual(governanceDocuments.map(({ id, codigo, versao }) => [id, codigo, versao]), [
  ['pld-aml', 'MC-GOV-001', '1.0'],
  ['privacidade-lgpd', 'MC-GOV-002', '1.0'],
  ['seguranca-informacao', 'MC-GOV-003', '1.0'],
  ['etica-conduta', 'MC-GOV-004', '1.0'],
  ['alocacao-capital', 'MC-GOV-005', '1.0'],
  ['termos-uso', 'MC-GOV-006', '1.0'],
  ['capacitacao', 'MC-GOV-007', '1.0'],
  ['atestacao-asseguracao', 'MC-GOV-008', '1.0'],
  ['governanca-ia', 'MC-GOV-009', '1.0'],
]);

function checkActions(html, documents, directory) {
  const items = [...html.matchAll(/<li\b[^>]*data-document-id="([^"]+)"[^>]*>(.*?)<\/li>/gs)];
  assert.deepEqual(items.map(([, id]) => id), documents.map(document => document.id), 'Ordem dos documentos');
  for (let i = 0; i < items.length; i++) {
    const document = documents[i], item = items[i][0];
    assert.ok(item.includes(`data-document-state="${document.estado}"`), `Estado incorreto: ${document.id}`);
    assert.ok(item.includes(`— ${document.codigo} · v${document.versao}`), `Versão ausente: ${document.id}`);
    const file = publishedFile(document, directory);
    if (document.estado === 'em_elaboracao') {
      assert.ok(!/<a\b|\bhref\s*=/i.test(item), `Download proibido para documento em elaboração: ${document.id}`);
      assert.match(item, /<button\b[^>]*\bdisabled(?:\s|>)/, `Botão precisa estar desabilitado: ${document.id}`);
      assert.ok(item.includes('data-i18n="governance.draft"'));
      assert.ok(item.includes('data-i18n="governance.note"'));
    } else {
      assert.ok(item.includes(`href="${file}"`));
      assert.match(item, /<a\b[^>]*\bdownload\s[^>]*target="_blank"[^>]*rel="noopener"/);
      assert.ok(item.includes('data-i18n="governance.published"'));
      assert.ok(!/<button\b/.test(item));
    }
  }
}

for (const language of languages) {
  const html = await readFile(`dist${languagePath(language, 'governance')}index.html`, 'utf8');
  assert.match(html, /<ul\b[^>]*class="governance-list"[^>]*role="list"/);
  checkActions(html, governanceDocuments);
  for (const document of governanceDocuments) assert.ok(html.includes(document.nome[language]), `Nome traduzido ausente: ${language}/${document.id}`);
  const home = await readFile(`dist${languagePath(language)}index.html`, 'utf8');
  const teaser = home.match(/<section id="documentos"[\s\S]*?<\/section>/)?.[0];
  assert.ok(teaser?.includes(dictionaries[language]['governance.home.title']));
  assert.ok(teaser.includes(`href="${languagePath(language, 'governance')}"`));
  for(const page of ['home','services',...audiences.map(a=>a.id),...catalogue.map(s=>s.page),...useCases.map(c=>c.page)]){
    const html=await readFile(`dist${languagePath(language,page)}index.html`,'utf8');
    const main=html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)[1];
    assert.ok(main.includes(dictionaries[language]['catalog.partner']),'Qualificação dos parceiros deve acompanhar o conteúdo');
    if(main.includes('id="security"')){
      for(const key of ['safety.keys','safety.kyb','safety.2fa','safety.pending','catalog.vault.desc'])assert.ok(main.includes(dictionaries[language][key]));
      assert.ok(!/\b(?:ISO|SOC|PCI)[-\s]?\d*\b|1:1/.test(main),'Sem selo ou segregação quantificada sem prova');
    }
    if(main.includes('data-rail=')){
      assert.equal([...main.matchAll(/data-availability="available"/g)].length,paymentRails.length);
      assert.equal([...main.matchAll(/data-i18n="catalog.available"/g)].length,paymentRails.length);
      assert.ok(main.includes(dictionaries[language]['catalog.timing']));
      assert.ok(main.includes(dictionaries[language]['catalog.rails.note']));
    }
    if(page==='case-commerce'||page==='case-logistics')assert.ok(main.includes(dictionaries[language][`case.${page.slice(5)}.timing`]));
    assert.ok(!/\b(?:testimonial|certification-badge)\b/.test(main),'Depoimentos e selos exigem prova real');
  }
}

// Exercita os dois estados e erros reais sem colocar qualquer PDF no projeto.
const fixtures = await mkdtemp(join(tmpdir(), 'mutucoin-governance-'));
try {
  const publicRoot = join(fixtures, 'public');
  await mkdir(publicRoot);
  await writeFile(join(publicRoot, 'approved.pdf'), '%PDF-1.4\n%%EOF\n');
  await writeFile(join(fixtures, 'outside.pdf'), '%PDF-1.4\n%%EOF\n');
  await symlink(join(fixtures, 'outside.pdf'), join(publicRoot, 'escape.pdf'));
  await mkdir(join(publicRoot, 'directory.pdf'));
  const draft = { ...governanceDocuments[0], arquivo: '/approved.pdf' };
  const published = { ...draft, estado: 'publicado' };
  assert.equal(publishedFile(draft, publicRoot), null);
  checkActions(renderGovernanceDocuments('pt-BR', [draft], publicRoot), [draft], publicRoot);
  checkActions(renderGovernanceDocuments('pt-BR', [published], publicRoot), [published], publicRoot);
  for (const arquivo of [null, '/missing.pdf', '/directory.pdf', '/file.txt', '/escape.pdf', '/../outside.pdf', '//example.invalid/file.pdf', 'https://example.invalid/file.pdf']) {
    assert.throws(() => validateGovernanceDocuments([{ ...published, arquivo }], publicRoot), /PDF publicado|PDF válido/, `Publicação inválida deveria falhar: ${arquivo}`);
    assert.throws(() => renderGovernanceDocuments('pt-BR', [{ ...published, arquivo }], publicRoot));
  }
  const withDraftLink = renderGovernanceDocuments('pt-BR', [draft], publicRoot).replace('<button ', '<a href="/approved.pdf" ');
  assert.throws(() => checkActions(withDraftLink, [draft], publicRoot), /Download proibido/);
  assert.throws(() => validateGovernanceDocuments([{ ...draft, nome: { ...draft.nome, ar: '' } }], publicRoot), /sem tradução/);
  assert.throws(() => validateGovernanceDocuments([{ ...draft, estado: 'outro' }], publicRoot), /Estado/);
} finally {
  await rm(fixtures, { recursive: true, force: true });
}
console.log(`Governança verificada: documentos nos ${languages.length} idiomas; bloqueio em elaboração; publicação apenas com PDF local existente; falhas simuladas detectadas.`);
