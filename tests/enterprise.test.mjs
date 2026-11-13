import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { languages, dictionaries, renderHTML, languagePath } from '../config/site.js';
import { resolvePath } from '../config/routes.js';

const template = readFileSync('index.html', 'utf8');

test('página empresarial existe nos sete idiomas e mantém somente o terminal público', () => {
  for (const language of languages) {
    assert.deepEqual(resolvePath(languagePath(language, 'enterprise')), { language, page: 'enterprise' });
    const html = renderHTML(template, language, 'https://mutucoin.local.invalid', 'enterprise');
    const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)[1];

    assert.equal([...main.matchAll(/<h1\b/g)].length, 1);
    assert.equal([...main.matchAll(/class="enterprise-sector content-card"/g)].length, 5);
    assert.equal([...main.matchAll(/class="enterprise-control content-card"/g)].length, 12);
    assert.equal([...main.matchAll(/class="enterprise-role"/g)].length, 3);
    assert.equal([...main.matchAll(/class="enterprise-trust-card content-card"/g)].length, 4);
    assert.equal([...main.matchAll(/class="enterprise-layer"/g)].length, 4);
    assert.equal([...main.matchAll(/class="enterprise-journey-number"/g)].length, 4);
    assert.equal([...main.matchAll(/class="enterprise-service content-card"/g)].length, 12);
    assert.equal([...main.matchAll(/class="mascot-purpose-card"/g)].length, 3);
    assert.equal([...main.matchAll(/class="demo-step"/g)].length, 0);
    assert.equal([...main.matchAll(/role="tab"/g)].length, 0);
    assert.equal([...main.matchAll(/class="platform-security-card"/g)].length, 0);
    assert.equal([...main.matchAll(/class="platform-balance"/g)].length, 0);
    assert.equal([...main.matchAll(/class="story-toggle"/g)].length, 2);
    assert.ok(main.includes(dictionaries[language]['enterprise.demo.note']));
    assert.ok(main.includes(dictionaries[language]['enterprise.coverage.note']));
    assert.ok(main.includes(dictionaries[language]['enterprise.coverage.metric']));
    assert.ok(main.includes(dictionaries[language]['enterprise.coverage.settlement']));
    assert.ok(main.includes(dictionaries[language]['enterprise.institutional.title']));
    assert.ok(main.includes(dictionaries[language]['enterprise.mascot.title']));
    assert.ok(main.includes(dictionaries[language]['enterprise.mascot.note']));
    assert.ok(main.includes('/img/mutucoin-mascot-3d.jpeg'));
    assert.ok(main.includes('200+'));
    assert.ok(main.includes('D0') && main.includes('D1'));
    assert.ok(!/<form\b|type="password"|\bfetch\s*\(|WebSocket|wallet address/i.test(main));
    assert.equal([...main.matchAll(/<iframe\b/g)].length, 1);
    assert.ok(main.includes('data-public-src="https://demonstracao.mutucoin.xyz/"'));
    assert.ok(main.includes('sandbox="allow-scripts allow-same-origin"'));
    const terminalTag = main.match(/<iframe\b[^>]*data-terminal-frame[^>]*>/)?.[0] ?? '';
    assert.ok(!terminalTag.includes('loading="lazy"'));
  }
});

test('página empresarial conecta o catálogo existente sem prometer operação própria', () => {
  const html = renderHTML(template, 'pt-BR', 'https://mutucoin.local.invalid', 'enterprise');
  for (const page of ['service-accounts','service-vault','service-liquidity','service-payments','service-exchange','service-wealth','service-institutional','service-ramp','service-treasury','service-api','blockchain','case-trade']) {
    assert.ok(html.includes(`href="${languagePath('pt-BR', page)}"`), page);
  }
  for (const key of ['status.deployment', 'catalog.partner', 'enterprise.roles.title', 'enterprise.journey.title', 'enterprise.coverage.note', 'enterprise.demo.note']) {
    assert.ok(html.includes(dictionaries['pt-BR'][key]), key);
  }
});

test('demonstração pública prioriza o terminal e remove a maquete sintética', () => {
  for (const language of languages) {
    const html = renderHTML(template,language,'https://mutucoin.local.invalid','enterprise');
    const terminal = html.indexOf('class="terminal-demo"');
    assert.ok(terminal >= 0);
    assert.doesNotMatch(html,/<details class="enterprise-demo-disclosure">/);
    assert.doesNotMatch(html,/class="enterprise-demo platform-demo"/);
    assert.ok(html.includes('https://demonstracao.mutucoin.xyz/'));
  }
});
