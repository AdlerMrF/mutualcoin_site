import { leituraPublica, origemPublica } from '../../config/leitura-publica.js';

const exigir = (condicao) => { if (!condicao) throw new Error('Resposta pública fora da forma esperada.'); };
const objeto = v => v !== null && typeof v === 'object' && !Array.isArray(v);
const decimal = v => typeof v === 'string' && /^(?:0|[1-9]\d*)(?:\.\d+)?$/.test(v) && v.length <= 160;
const inteiro = v => typeof v === 'string' && /^(?:0|[1-9]\d*)$/.test(v) && v.length <= 80;
const hash = v => typeof v === 'string' && /^0x[\da-f]{64}$/i.test(v);
const endereco = v => typeof v === 'string' && /^0x[\da-f]{40}$/i.test(v);
const data = v => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/.test(v) && !isNaN(Date.parse(v));
const booleano = v => typeof v === 'boolean';

// Converte os tokens numéricos do JSON diretamente em texto, antes de JSON.parse.
// Assim nenhum preço, saldo ou quantidade passa por ponto flutuante.
export function lerJSONDecimal(texto) {
  return JSON.parse(texto.replace(/"(?:[^"\\\u0000-\u001f]|\\(?:["\\/bfnrt]|u[\da-fA-F]{4}))*"|(-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)/g,
    (token, numero) => numero === undefined ? token : JSON.stringify(numero)));
}
export function formatarDecimal(valor) {
  exigir(decimal(valor));
  const [parte, fracao] = valor.split('.');
  return parte.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + (fracao === undefined ? '' : `,${fracao}`);
}

function rede(v) {
  exigir(objeto(v) && ['mutucoin', 'mutucoin-testnet'].includes(v.id) && inteiro(v.chainId) && inteiro(v.blockNumber));
  exigir(v.chainId === (v.id === 'mutucoin' ? '28001' : '28002'));
  return { id: v.id, chainId: v.chainId, blockNumber: v.blockNumber };
}
function envelope(v, campo, limite) {
  exigir(objeto(v) && v.ok === true && v.network === 'mutucoin' && inteiro(v.total) && Array.isArray(v[campo]) && v[campo].length <= limite);
  return v[campo];
}
// Projeção por campos permitidos: nomes, descrições, emissor, título, assinatura,
// dados de pessoas e qualquer campo desconhecido nunca chegam à camada de tela.
const formas = {
  redes(v) {
    exigir(Array.isArray(v) && v.length > 0 && v.length <= 2);
    const redes = v.map(rede);
    exigir(new Set(redes.map(r => r.id)).size === redes.length && redes.some(r => r.id === 'mutucoin'));
    return redes;
  },
  redeTeste(v) { const r = rede(v); exigir(r.id === 'mutucoin-testnet' && r.chainId === '28002'); return r; },
  preco(v) {
    exigir(objeto(v) && decimal(v.usd) && v.symbol === 'MTC' && data(v.updatedAt));
    return { usd: v.usd, symbol: 'MTC', updatedAt: v.updatedAt };
  },
  blocos(v) {
    exigir(Array.isArray(v) && v.length <= 12);
    return v.map(b => {
      exigir(objeto(b) && inteiro(b.number) && hash(b.hash) && inteiro(b.timestamp) && inteiro(b.txCount) && Array.isArray(b.txs) && b.txs.length <= 1000);
      const txs = b.txs.map(tx => { const h = objeto(tx) ? tx.hash : tx; exigir(hash(h)); return h; });
      exigir(b.txCount === String(txs.length));
      return { number: b.number, hash: b.hash, timestamp: b.timestamp, txCount: b.txCount, txs };
    });
  },
  faucet(v) {
    exigir(objeto(v) && v.netId === 'mutucoin-testnet' && booleano(v.enabled) && decimal(v.nativeBalance) && objeto(v.tokenBalances) && decimal(v.tokenBalances.MTC));
    return { netId: 'mutucoin-testnet', enabled: v.enabled, nativeBalance: v.nativeBalance, mtcBalance: v.tokenBalances.MTC };
  },
  registros(v) {
    const registros = envelope(v, 'records', 50).map(r => {
      exigir(objeto(r) && booleano(r.exists) && hash(r.contentHash) && inteiro(r.timestamp) && inteiro(r.blockNumber));
      return { exists: r.exists, contentHash: r.contentHash, timestamp: r.timestamp, blockNumber: r.blockNumber };
    });
    return { total: v.total, registros };
  },
  ativos(v) {
    const ativos = envelope(v, 'assets', 50).map(a => {
      exigir(objeto(a) && (inteiro(a.assetId) || hash(a.assetId)) && endereco(a.token) && decimal(a.totalSupply) && inteiro(a.createdBlock) && booleano(a.active));
      return { assetId: a.assetId, token: a.token, totalSupply: a.totalSupply, createdBlock: a.createdBlock, active: a.active };
    });
    return { total: v.total, ativos };
  },
  contratos(v) {
    exigir(objeto(v) && v.ok === true && Array.isArray(v.artifacts) && v.artifacts.length <= 100);
    return v.artifacts.map(a => {
      exigir(objeto(a) && (a.address === null || endereco(a.address)) && (a.txHash === null || hash(a.txHash)) && inteiro(a.bytecodeLength) && data(a.updatedAt));
      return { address: a.address, txHash: a.txHash, bytecodeLength: a.bytecodeLength, updatedAt: a.updatedAt };
    });
  },
};

async function corpoLimitado(resposta, limite) {
  const tamanho = resposta.headers.get('content-length');
  if (tamanho !== null) exigir(/^\d+$/.test(tamanho) && BigInt(tamanho) <= BigInt(limite));
  exigir(/^(?:application\/json)(?:\s*;|$)/i.test(resposta.headers.get('content-type') || ''));
  exigir(resposta.body && typeof resposta.body.getReader === 'function');
  const leitor = resposta.body.getReader();
  const decoder = new TextDecoder('utf-8', { fatal: true });
  let bytes = 0, texto = '';
  try {
    while (true) {
      const { done, value } = await leitor.read();
      if (done) break;
      bytes += value.byteLength;
      exigir(bytes <= limite);
      texto += decoder.decode(value, { stream: true });
    }
    return texto + decoder.decode();
  } finally {
    await leitor.cancel().catch(() => {});
  }
}

export function criarLeitor({ configuracao = leituraPublica, fetchImpl = globalThis.fetch } = {}) {
  const base = origemPublica(configuracao.base);
  const { tempoLimiteMs, maxRespostaBytes } = configuracao;
  exigir(Number.isInteger(tempoLimiteMs) && tempoLimiteMs > 0 && tempoLimiteMs <= 5000);
  exigir(Number.isInteger(maxRespostaBytes) && maxRespostaBytes > 0 && maxRespostaBytes <= 1048576);
  const caminhos = new Map(configuracao.caminhos.map(item => [item.caminho, item.forma]));
  // O chamador só pode escolher caminho exato e método. Não pode injetar opções,
  // parâmetros, cabeçalhos ou credenciais, nem seguir um redirecionamento.
  return async function consultar(caminho, metodo = 'GET') {
    if (metodo !== 'GET' || typeof caminho !== 'string' || !caminhos.has(caminho)) throw new Error('Consulta pública não permitida.');
    const url = new URL(caminho, base);
    const forma = formas[caminhos.get(caminho)];
    if (url.origin !== base || url.pathname + url.search !== caminho || url.hash || url.username || url.password || typeof forma !== 'function') throw new Error('Caminho público inválido.');
    const ultimaTentativa = new Date().toISOString();
    const controlador = new AbortController();
    let temporizador;
    try {
      const trabalho = (async () => {
        const resposta = await fetchImpl(url.href, { method: 'GET', credentials: 'omit', redirect: 'error', mode: 'cors', cache: 'no-store', referrerPolicy: 'no-referrer', signal: controlador.signal });
        exigir(resposta.ok && !resposta.redirected && resposta.type !== 'opaqueredirect');
        if (resposta.url) exigir(resposta.url === url.href);
        return forma(lerJSONDecimal(await corpoLimitado(resposta, maxRespostaBytes)));
      })();
      const limite = new Promise((_, reject) => { temporizador = setTimeout(() => { controlador.abort(); reject(new Error('Tempo limite da consulta.')); }, tempoLimiteMs); });
      const dados = await Promise.race([trabalho, limite]);
      return { estado: 'disponivel', dados, ultimaTentativa };
    } catch {
      controlador.abort();
      return { estado: 'indisponivel', ultimaTentativa };
    } finally { clearTimeout(temporizador); }
  };
}
export const consultarPublico = criarLeitor();
