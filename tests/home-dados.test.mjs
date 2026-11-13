import test from 'node:test';
import assert from 'node:assert/strict';
import { lerMovimentoPublico, formatarNumeroPublico, passoContador, mostrarMovimentoPublico } from '../src/home-dados.js';
import { criarLeitor } from '../src/plataforma/leitura.js';
import { dictionaries, languages } from '../config/site.js';

const criarDocumento = idioma => {
  const paineis = ['volume', 'wallets', 'assets'].map(id => {
    const campos = Object.fromEntries(['value', 'accessible', 'status'].map(nome => [`[data-counter-${nome}]`, { textContent: '—' }]));
    return { dataset: { networkCounter: id }, campos, querySelector: seletor => campos[seletor] };
  });
  const status = { textContent: '' };
  const preco = { textContent: '—', parentElement: { querySelector: () => status } };
  return {
    documentElement: { lang: idioma }, paineis, preco, status,
    getElementById: () => ({ textContent: JSON.stringify(dictionaries[idioma]) }),
    querySelectorAll: seletor => seletor === '[data-network-counter]' ? paineis : [preco],
  };
};
const resposta = dados => new Response(JSON.stringify(dados), { headers: { 'content-type': 'application/json' } });

test('sem dado, erro, formato inválido ou campos indevidos: — nos três contadores, nunca zero nem animação', async () => {
  const casos = [
    criarLeitor({ fetchImpl: async () => { throw new TypeError('Falha de rede simulada'); } }),
    criarLeitor({ fetchImpl: async () => new Response('{}', { status: 503 }) }),
    criarLeitor({ fetchImpl: async () => resposta({ total: 0, volume: '123', wallets: '456', usd: '999' }) }),
    async () => { throw new Error('Erro inesperado'); },
  ];
  for (const consultar of casos) for (const idioma of languages) {
    const dados = await lerMovimentoPublico(consultar);
    assert.deepEqual(dados, { volume: null, wallets: null, assets: null, price: null });
    const doc = criarDocumento(idioma);
    mostrarMovimentoPublico(doc, dados, { animar: () => assert.fail('Não pode animar uma ausência') });
    for (const painel of doc.paineis) {
      assert.equal(painel.campos['[data-counter-value]'].textContent, '—');
      assert.equal(painel.campos['[data-counter-accessible]'].textContent, '—');
      assert.equal(painel.campos['[data-counter-status]'].textContent, dictionaries[idioma]['status.deployment']);
      assert.equal(painel.dataset.counterState, 'pending');
    }
    assert.equal(doc.preco.textContent, '—');
    assert.equal(doc.status.textContent, dictionaries[idioma]['status.deployment']);
  }
});

test('só os dois caminhos aprovados da B6 são lidos; volume e carteiras não são inferidos de outros campos', async () => {
  const chamadas = [];
  const leitor = criarLeitor({ fetchImpl: async (url, options) => {
    chamadas.push({ url, options });
    return resposta(url.includes('/price')
      ? { symbol: 'MTC', usd: '0.000001234567890123456789', updatedAt: '2026-10-28T12:00:00Z' }
      : { ok: true, network: 'mutucoin', total: '90071992547409931234567890', assets: [], volume: '888', wallets: '999' });
  } });
  const dados = await lerMovimentoPublico(leitor);
  assert.deepEqual(chamadas.map(x => new URL(x.url).pathname).sort(), ['/api/assets/list', '/api/networks/mutucoin/price']);
  assert.ok(chamadas.every(x => x.options.method === 'GET' && x.options.credentials === 'omit'));
  assert.equal(dados.volume, null); assert.equal(dados.wallets, null);
  assert.equal(dados.assets, '90071992547409931234567890');
  assert.equal(dados.price, '0.000001234567890123456789');
  for (const idioma of languages) {
    const doc = criarDocumento(idioma), animacoes = [];
    mostrarMovimentoPublico(doc, dados, { animar: (...args) => animacoes.push(args) });
    assert.equal(animacoes.length, 1); assert.equal(animacoes[0][1], dados.assets);
    assert.equal(doc.paineis[0].campos['[data-counter-value]'].textContent, '—');
    assert.equal(doc.paineis[1].campos['[data-counter-value]'].textContent, '—');
    assert.equal(doc.paineis[2].campos['[data-counter-accessible]'].textContent, formatarNumeroPublico(dados.assets, idioma));
    assert.equal(doc.preco.textContent, `${formatarNumeroPublico(dados.price, idioma)} USD / MTC`);
  }
});

test('falha parcial não apaga o outro dado; zero real só vem de resposta pública válida', async () => {
  for (const falha of ['price', 'assets']) {
    const dados = await lerMovimentoPublico(criarLeitor({ fetchImpl: async url => {
      if ((url.includes('/price') ? 'price' : 'assets') === falha) throw new Error('Falha parcial');
      return resposta(url.includes('/price')
        ? { symbol: 'MTC', usd: '0', updatedAt: '2026-10-28T12:00:00Z' }
        : { ok: true, network: 'mutucoin', total: '0', assets: [] });
    } }));
    assert.equal(dados[falha], null);
    assert.equal(dados[falha === 'price' ? 'assets' : 'price'], '0');
    const doc = criarDocumento('pt-BR');
    mostrarMovimentoPublico(doc, dados, { animar: () => assert.fail('Zero real fica direto no estado final') });
    assert.equal(doc.paineis[2].campos['[data-counter-value]'].textContent, falha === 'assets' ? '—' : '0');
  }
});

test('subida preserva inteiros grandes e casas decimais; o estado final é exato em todos os idiomas', () => {
  assert.equal(passoContador('90071992547409931234567890', 500), '45035996273704965617283945');
  assert.equal(passoContador('0.000000000000000002', 500), '0.000000000000000001');
  assert.equal(formatarNumeroPublico('1234567.001234567890123456789', 'pt-BR'), '1.234.567,001234567890123456789');
  assert.equal(formatarNumeroPublico('1234567.001234567890123456789', 'en'), '1,234,567.001234567890123456789');
  assert.equal(formatarNumeroPublico('1234.56', 'ar'), '١٬٢٣٤٫٥٦');
  for (const idioma of languages) for (const valor of ['0', '123456789012345678901234567890.000000000000000001']) {
    assert.equal(passoContador(valor, 1000), valor);
    assert.equal(formatarNumeroPublico(passoContador(valor, 1000), idioma), formatarNumeroPublico(valor, idioma));
  }
});
