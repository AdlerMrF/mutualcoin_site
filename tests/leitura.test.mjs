import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { criarLeitor, formatarDecimal, lerJSONDecimal } from '../src/plataforma/leitura.js';
import { iniciarConsultas, mostrarDados, buscarHash } from '../src/plataforma/tela.js';
import { leituraPublica, origemPublica } from '../config/leitura-publica.js';
import { securityHeaders } from '../config/site.js';
import { plataforma } from '../config/plataforma.js';
import mapa from '../config/mapa-plataforma.json' with { type: 'json' };
import { languages, dictionaries } from '../config/site.js';

const hash = '0x' + 'a'.repeat(64), address = '0x' + 'b'.repeat(40), date = '2026-10-28T12:00:00.000Z';
const rede = (id = 'mutucoin') => ({ id, chainId: id === 'mutucoin' ? '28001' : '28002', blockNumber: '12345678901234567890' });
const amostras = {
  redes: [rede(), rede('mutucoin-testnet')],
  redeTeste: rede('mutucoin-testnet'),
  preco: { usd: '5.055', symbol: 'MTC', updatedAt: date },
  blocos: [{ number: '12', hash, timestamp: '1234567890', txCount: '1', txs: [{ hash, from: address, name: 'PESSOA_SINTETICA' }] }],
  faucet: { netId: 'mutucoin-testnet', enabled: true, nativeBalance: '0.100000000000000001', tokenBalances: { MTC: '123456789012345678901234567890.123456' } },
  registros: { ok: true, network: 'mutucoin', total: '1', records: [{ exists: true, contentHash: hash, timestamp: '1234567890', blockNumber: '15', title: 'PESSOA_SINTETICA', signer: address, issuerName: 'PESSOA_SINTETICA' }] },
  ativos: { ok: true, network: 'mutucoin', total: '1', assets: [{ assetId: '1', token: address, totalSupply: '90071992547409931234567890.123456789', createdBlock: '15', active: true, issuerName: 'PESSOA_SINTETICA', issuer: address, name: 'PESSOA_SINTETICA', symbol: 'PESSOA_SINTETICA', description: 'PESSOA_SINTETICA', email: 'PESSOA_SINTETICA', nested: { fullName: 'PESSOA_SINTETICA' } }] },
  contratos: { ok: true, artifacts: [{ name: 'PESSOA_SINTETICA', file: 'PESSOA_SINTETICA', address, txHash: hash, bytecodeLength: '123', updatedAt: date }] },
};
const caminho = forma => leituraPublica.caminhos.find(item => item.forma === forma).caminho;
const resposta = (v, options = {}) => new Response(typeof v === 'string' ? v : JSON.stringify(v), { headers: { 'content-type': 'application/json' }, ...options });
const consultarCom = (fetchImpl, config = {}) => criarLeitor({ fetchImpl, configuracao: { ...leituraPublica, ...config } });

class No {
  constructor(doc, text = '') { this.ownerDocument = doc; this.children = []; this._text = text; this.dataset = {}; this.disabled = false; this.nodes = {}; this.events = {}; }
  append(child) { this.children.push(child); }
  replaceChildren() { this.children = []; this._text = ''; }
  set textContent(v) { this._text = v; this.children = []; }
  get textContent() { return this._text + this.children.map(n => n.textContent).join(' '); }
  querySelector(selector) { return this.nodes[selector]; }
  addEventListener(name, callback) { this.events[name] = callback; }
}
const docSimulado = () => ({ createElement(tag) { const n = new No(this); n.tag = tag; return n; } });
const t = chave => chave;

test('a lista fechada corresponde ao mapa; CSP permite somente a origem configurada', () => {
  assert.equal(new Set(leituraPublica.caminhos.map(x => x.caminho)).size, leituraPublica.caminhos.length);
  for (const item of leituraPublica.caminhos) { assert.ok(item.mapa.startsWith('GET ')); assert.ok(mapa.endpoints.includes(item.mapa)); }
  const csp = securityHeaders('https://mutucoin.local.invalid', false)['Content-Security-Policy'];
  assert.equal(csp.split('; ').find(x => x.startsWith('connect-src')), `connect-src ${leituraPublica.base}`);
  for (const base of ['http://api.mutucoin.net', 'https://user:senha@api.mutucoin.net', 'https://api.mutucoin.net/api', 'https://api.mutucoin.net?x=1', 'https://api.mutucoin.net/#x']) assert.throws(() => origemPublica(base));
});

test('métodos, caminhos, parâmetros e opções fora da lista falham antes de sair', async () => {
  let chamadas = 0;
  const consulta = consultarCom(() => { chamadas++; throw new Error('Não deve sair'); });
  for (const metodo of ['POST','HEAD','PUT','DELETE','get',null, { method: 'GET', headers: { Authorization: 'segredo-sintetico' } }]) await assert.rejects(consulta(caminho('redes'), metodo));
  for (const path of ['/api/admin/contracts','/api/person/me','/api/person/miles/1/check-payment','/api/faucet','/api/networks/mutucoin/faucet','/api/rpc','https://api.mutucoin.net/api/networks','//outra.invalid/api/networks','/api/networks?extra=1','/api/networks#x','/api/%6eetworks','/api/assets/list?limit=50&network=mutucoin']) await assert.rejects(consulta(path));
  assert.equal(chamadas, 0);
});

test('GET sem cabeçalhos, cookies, credenciais, redirecionamentos ou cache e base configurável', async () => {
  let chamada;
  const consulta = consultarCom(async (...args) => { chamada = args; return resposta(amostras.preco); }, { base: 'https://publica.example' });
  assert.equal((await consulta(caminho('preco'))).estado, 'disponivel');
  const [url, options] = chamada;
  assert.equal(url, 'https://publica.example' + caminho('preco'));
  assert.deepEqual(Object.keys(options).sort(), ['method','credentials','redirect','mode','cache','referrerPolicy','signal'].sort());
  assert.equal(options.method, 'GET'); assert.equal(options.credentials, 'omit'); assert.equal(options.redirect, 'error'); assert.equal(options.mode, 'cors');
  assert.equal(options.cache, 'no-store'); assert.equal(options.referrerPolicy, 'no-referrer'); assert.ok(options.signal instanceof AbortSignal);
});

test('todos os formatos públicos são validados e projetados antes da tela', async () => {
  for (const item of leituraPublica.caminhos) {
    const result = await consultarCom(async () => resposta(amostras[item.forma]))(item.caminho);
    assert.equal(result.estado, 'disponivel', item.forma);
    assert.match(result.ultimaTentativa, /^\d{4}-/);
    assert.ok(!JSON.stringify(result).includes('PESSOA_SINTETICA'));
    const invalidas = [null, {}, 'null', '{'];
    if (['ativos','registros','contratos'].includes(item.forma)) invalidas.push({ ...amostras[item.forma], ok: false });
    for (const bad of invalidas) {
      const invalid = await consultarCom(async () => resposta(bad))(item.caminho);
      assert.equal(invalid.estado, 'indisponivel', item.forma);
      assert.equal(Object.hasOwn(invalid, 'dados'), false);
    }
  }
});

test('campos faltantes e tipos incorretos de cada resposta resultam em indisponibilidade', async () => {
  const casos = [
    ['redes', [{ ...rede(), blockNumber: null }]], ['redes', [rede(), rede()]],
    ['redeTeste', rede()], ['redeTeste', { ...rede('mutucoin-testnet'), chainId: '28001' }],
    ['preco', { ...amostras.preco, usd: null }], ['preco', { ...amostras.preco, usd: 'NaN' }], ['preco', { ...amostras.preco, symbol: 'USDT' }],
    ['preco', { ...amostras.preco, updatedAt: false }], ['blocos', [{ ...amostras.blocos[0], txs: ['inválida'] }]],
    ['blocos', [{ ...amostras.blocos[0], txCount: '2' }]], ['faucet', { ...amostras.faucet, netId: 'mutucoin' }],
    ['faucet', { ...amostras.faucet, enabled: 'true' }], ['faucet', { ...amostras.faucet, tokenBalances: {} }],
    ['ativos', { ...amostras.ativos, assets: [{ ...amostras.ativos.assets[0], totalSupply: null }] }],
    ['ativos', { ...amostras.ativos, assets: [{ ...amostras.ativos.assets[0], active: 'true' }] }],
    ['registros', { ...amostras.registros, records: [{ ...amostras.registros.records[0], contentHash: 'inválido' }] }],
    ['contratos', { ...amostras.contratos, artifacts: [{ ...amostras.contratos.artifacts[0], address: 'inválido' }] }],
  ];
  for (const [forma, v] of casos) assert.equal((await consultarCom(async () => resposta(v))(caminho(forma))).estado, 'indisponivel', forma);
});

test('números JSON são lidos como texto sem perder casas; dinheiro nunca é arredondado ou preenchido', async () => {
  const raw = '{"usd":90071992547409931234567890.123456789,"symbol":"MTC","updatedAt":"' + date + '"}';
  const result = await consultarCom(async () => resposta(raw))(caminho('preco'));
  assert.equal(result.dados.usd, '90071992547409931234567890.123456789');
  assert.equal(formatarDecimal(result.dados.usd), '90.071.992.547.409.931.234.567.890,123456789');
  assert.equal(formatarDecimal('0.000000000000000001'), '0,000000000000000001');
  assert.equal(lerJSONDecimal('{"number":12,"string":"issuerName 123"}').number, '12');
  for (const valor of [undefined, null, 0, '', '1e3', 'NaN', '-1', '01']) assert.throws(() => formatarDecimal(valor));
});

test('issuerName, nomes e campos pessoais inclusive aninhados são descartados antes de renderizar', async () => {
  for (const forma of ['ativos','registros','contratos','blocos']) {
    const result = await consultarCom(async () => resposta(amostras[forma]))(caminho(forma));
    const json = JSON.stringify(result.dados);
    for (const forbidden of ['issuerName', 'issuer"', 'name"', 'symbol"', 'email', 'nested', 'title', 'signer', 'PESSOA_SINTETICA']) assert.ok(!json.includes(forbidden), `${forma}/${forbidden}`);
    const pai = new No(docSimulado());
    mostrarDados(pai, forma, result.dados, t);
    assert.ok(!pai.textContent.includes('PESSOA_SINTETICA'));
  }
});

test('erros HTTP, CORS, redirecionamento, JSON inválido e limites geram estado sem dado fictício', async () => {
  const redirect = resposta(amostras.preco); Object.defineProperty(redirect, 'redirected', { value: true });
  const destino = resposta(amostras.preco); Object.defineProperty(destino, 'url', { value: 'https://outra.invalid' });
  const casos = [() => Promise.reject(new TypeError('CORS')), () => resposta('{}', { status: 429 }), () => resposta('{}', { status: 503 }),
    () => resposta('', { status: 302, headers: { location: 'https://outra.invalid' } }), () => redirect, () => destino,
    () => resposta('<html>erro</html>', { headers: { 'content-type': 'text/html' } }), () => resposta('{"usd":01}'),
    () => resposta(' '.repeat(101)), () => resposta('{}', { headers: { 'content-type': 'application/json', 'content-length': '101' } })];
  for (const fetchImpl of casos) {
    const result = await consultarCom(fetchImpl, { maxRespostaBytes: 100 })(caminho('preco'));
    assert.deepEqual(Object.keys(result).sort(), ['estado','ultimaTentativa']);
    assert.equal(result.estado, 'indisponivel'); assert.ok(!isNaN(Date.parse(result.ultimaTentativa)));
  }
});

test('limite também conta múltiplos pedaços da resposta e encerra a leitura', async () => {
  let cancelado = false;
  const stream = new ReadableStream({ start(c) { c.enqueue(new Uint8Array(60)); c.enqueue(new Uint8Array(60)); }, cancel() { cancelado = true; } });
  const result = await consultarCom(async () => new Response(stream, { headers: { 'content-type': 'application/json' } }), { maxRespostaBytes: 100 })(caminho('preco'));
  assert.equal(result.estado, 'indisponivel'); assert.equal(cancelado, true);
});

test('tempo limite cobre espera inicial e corpo travado, com cancelamento', async () => {
  for (const corpo of [false, true]) {
    let sinal;
    const consulta = consultarCom(async (_url, options) => {
      sinal = options.signal;
      if (!corpo) return new Promise(() => {});
      return new Response(new ReadableStream({ start() {} }), { headers: { 'content-type': 'application/json' } });
    }, { tempoLimiteMs: 15 });
    const result = await consulta(caminho('preco'));
    assert.equal(result.estado, 'indisponivel'); assert.equal(sinal.aborted, true);
  }
});

test('Cartório busca apenas no lote público e nunca transforma ausência em inexistência global', () => {
  const dados = { registros: [{ exists: true, contentHash: hash, blockNumber: '1' }] };
  assert.equal(buscarHash(dados, hash.toUpperCase().replace('0X', '0x')).estado, 'encontrado');
  assert.equal(buscarHash(dados, '0x' + 'c'.repeat(64)).estado, 'fora_da_lista');
  assert.equal(buscarHash(dados, '/api/person/me').estado, 'invalido');
});

test('fluxo das telas em simulação mantém operações desligadas; Faucet exige a testnet 28002', async () => {
  const dictionary = JSON.parse(await readFile(new URL('../src/i18n/pt-BR.json', import.meta.url), 'utf8'));
  for (const item of plataforma.filter(i => i.leitura_publica)) {
    const doc = docSimulado(); const paineis = item.leitura_publica.map(forma => {
      const n = new No(doc); n.dataset.readingKind = forma;
      for (const selector of ['[data-reading-status]','[data-reading-attempt]','[data-reading-data]','#public-notary-hash','#public-notary-query','[data-reading-result]']) { n.nodes[selector] = new No(doc); n.nodes[selector].disabled = true; }
      return n;
    });
    doc.getElementById = () => ({ textContent: JSON.stringify(dictionary) }); doc.querySelectorAll = () => paineis;
    const calls = [];
    const consulta = consultarCom(async url => { calls.push(new URL(url).pathname); const forma = leituraPublica.caminhos.find(c => leituraPublica.base + c.caminho === url).forma; return resposta(amostras[forma]); });
    await iniciarConsultas(doc, consulta);
    for (const painel of paineis) {
      assert.equal(painel.dataset.readingState, 'disponivel');
      assert.equal(painel.nodes['[data-reading-status]'].dataset.i18n, 'reading.available');
      assert.equal(painel.nodes['[data-reading-status]'].textContent, dictionary['reading.available']);
      assert.ok(painel.nodes['[data-reading-attempt]'].textContent.includes('Última tentativa'));
      if (item.move_valor) {
        assert.equal(painel.nodes['#public-notary-query'].disabled, true); assert.equal(painel.nodes['#public-notary-hash'].disabled, true);
        const conferir = n => {
          assert.ok(!['button','input','select','textarea','a','form'].includes(n.tag) || n.disabled, `Ação habilitada em módulo que move valor: ${item.id}/${n.tag}`);
          n.children.forEach(conferir);
        };
        conferir(painel.nodes['[data-reading-data]']);
      }
    }
    if (item.id === 'faucet') assert.deepEqual(calls, ['/api/networks/mutucoin-testnet','/api/networks/mutucoin-testnet/faucet']);
    if (item.id === 'notary') { const n = paineis[0]; n.nodes['#public-notary-hash'].value = hash; n.nodes['#public-notary-query'].events.click(); assert.ok(n.nodes['[data-reading-result]'].textContent.includes(hash)); }
  }
  // Identidade da rede incorreta: não consulta o saldo e não habilita nada.
  const doc = docSimulado(), n = new No(doc); n.dataset.readingKind = 'faucet';
  for (const s of ['[data-reading-status]','[data-reading-attempt]','[data-reading-data]']) n.nodes[s] = new No(doc);
  doc.getElementById = () => ({ textContent: JSON.stringify(dictionary) }); doc.querySelectorAll = () => [n];
  let calls = 0;
  await iniciarConsultas(doc, consultarCom(async () => { calls++; return resposta(rede()); }));
  assert.equal(calls, 1); assert.equal(n.nodes['[data-reading-status]'].textContent, 'Indisponível no momento');
  assert.equal(n.nodes['[data-reading-data]'].textContent, '');
  assert.ok(n.nodes['[data-reading-attempt]'].textContent.includes('Última tentativa'));
});

test('resposta ausente ou rejeitada mostra indisponibilidade traduzida, sem habilitar ações', async () => {
  const consultas = [async () => null, async () => undefined, async () => ({ estado: 'disponivel', dados: null }), async () => { throw new Error('Consulta indisponível'); }];
  for (const idioma of languages) for (const consultar of consultas) for (const forma of ['preco','faucet','redes','blocos']) {
    const doc = docSimulado(), painel = new No(doc);
    painel.dataset.readingKind = forma;
    for (const selector of ['[data-reading-status]','[data-reading-attempt]','[data-reading-data]','#public-notary-hash','#public-notary-query']) {
      painel.nodes[selector] = new No(doc);
      painel.nodes[selector].disabled = true;
    }
    const status = painel.nodes['[data-reading-status]'];
    status.dataset.i18n = 'reading.loading';
    status.textContent = dictionaries[idioma]['reading.loading'];
    assert.ok(status.textContent?.trim(), `Carregamento sem tradução: ${idioma}`);
    doc.getElementById = () => ({ textContent: JSON.stringify(dictionaries[idioma]) });
    doc.querySelectorAll = () => [painel];
    let chamadas = 0;
    await iniciarConsultas(doc, async () => { chamadas++; return consultar(); });
    assert.equal(chamadas, 1, 'Ausência não repete consultas nem consulta o Faucet sem confirmar a rede');
    assert.equal(painel.dataset.readingState, 'indisponivel');
    assert.equal(status.dataset.i18n, 'reading.unavailable');
    assert.equal(status.textContent, dictionaries[idioma]['reading.unavailable']);
    assert.equal(painel.nodes['[data-reading-data]'].textContent, '');
    assert.equal(painel.nodes['#public-notary-hash'].disabled, true);
    assert.equal(painel.nodes['#public-notary-query'].disabled, true);
    assert.ok(!isNaN(Date.parse(painel.nodes['[data-reading-attempt]'].children[1].dateTime)));
  }
});
