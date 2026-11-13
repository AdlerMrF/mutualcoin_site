import { leituraPublica } from '../../config/leitura-publica.js';
import { consultarPublico, formatarDecimal } from './leitura.js';

function elemento(pai, tag, texto) {
  const no = pai.ownerDocument.createElement(tag);
  if (texto !== undefined) no.textContent = texto;
  pai.append(no);
  return no;
}
const campo = (pai, t, chave, valor) => elemento(pai, 'p', `${t(chave)}: ${valor}`);
const quantidade = formatarDecimal;

// Recebe somente a projeção segura do adaptador. Não insere HTML da API.
export function mostrarDados(pai, forma, dados, t) {
  pai.replaceChildren();
  const lista = Array.isArray(dados) ? dados : dados.ativos ?? dados.registros;
  if (lista?.length === 0) { elemento(pai, 'p', t('empty')); return; }
  if (forma === 'preco') {
    campo(pai, t, 'price', `${quantidade(dados.usd)} USD / MTC`);
    campo(pai, t, 'updated', dados.updatedAt);
  } else if (forma === 'faucet') {
    campo(pai, t, 'chain', '28002');
    elemento(pai, 'p', t(dados.enabled ? 'enabled' : 'disabled'));
    campo(pai, t, 'nativeBalance', `${quantidade(dados.nativeBalance)} OHR`);
    campo(pai, t, 'mtcBalance', `${quantidade(dados.mtcBalance)} MTC`);
  } else {
    const ul = elemento(pai, 'ul');
    for (const item of lista) {
      const li = elemento(ul, 'li');
      if (forma === 'redes') {
        elemento(li, 'h3', item.id === 'mutucoin' ? 'MutualChain' : 'MutualChain Testnet');
        campo(li, t, 'chain', item.chainId);
        campo(li, t, 'block', quantidade(item.blockNumber));
      } else if (forma === 'blocos') {
        campo(li, t, 'block', quantidade(item.number));
        campo(li, t, 'hash', item.hash);
        campo(li, t, 'transactions', quantidade(item.txCount));
        if (item.txs.length) {
          const transacoes = elemento(li, 'ul');
          for (const hash of item.txs) elemento(transacoes, 'li', hash);
        }
      } else if (forma === 'ativos') {
        campo(li, t, 'asset', item.assetId);
        campo(li, t, 'token', item.token);
        campo(li, t, 'supply', quantidade(item.totalSupply));
        elemento(li, 'p', t(item.active ? 'active' : 'inactive'));
      } else if (forma === 'registros') {
        campo(li, t, 'hash', item.contentHash);
        campo(li, t, 'block', quantidade(item.blockNumber));
      } else if (forma === 'contratos') {
        if (item.address !== null) campo(li, t, 'address', item.address);
        else elemento(li, 'p', t('noAddress'));
        if (item.txHash !== null) campo(li, t, 'transaction', item.txHash);
        campo(li, t, 'updated', item.updatedAt);
      }
    }
  }
}

export function buscarHash(dados, hash) {
  if (!/^0x[\da-f]{64}$/i.test(hash)) return { estado: 'invalido' };
  const registro = dados.registros.find(item => item.exists && item.contentHash.toLowerCase() === hash.toLowerCase());
  return registro ? { estado: 'encontrado', registro } : { estado: 'fora_da_lista' };
}

export async function iniciarConsultas(doc = document, consultar = consultarPublico) {
  const copia = JSON.parse(doc.getElementById('runtime-copy').textContent);
  const t = chave => copia[`reading.${chave}`];
  const porForma = forma => leituraPublica.caminhos.find(item => item.forma === forma).caminho;
  const consultarForma = async forma => {
    try {
      const resultado = await consultar(porForma(forma));
      if (resultado?.estado === 'disponivel' && resultado.dados != null) return resultado;
      return { estado: 'indisponivel', ultimaTentativa: resultado?.ultimaTentativa ?? new Date().toISOString() };
    } catch {
      return { estado: 'indisponivel', ultimaTentativa: new Date().toISOString() };
    }
  };
  await Promise.all([...doc.querySelectorAll('[data-reading-kind]')].map(async painel => {
    const forma = painel.dataset.readingKind;
    const status = painel.querySelector('[data-reading-status]');
    const tentativa = painel.querySelector('[data-reading-attempt]');
    const conteudo = painel.querySelector('[data-reading-data]');
    let resultado;
    // O Faucet só é consultado depois de confirmar a identidade 28002 da testnet.
    if (forma === 'faucet') {
      resultado = await consultarForma('redeTeste');
      if (resultado.estado === 'disponivel') resultado = await consultarForma('faucet');
    } else resultado = await consultarForma(forma);
    painel.dataset.readingState = resultado.estado;
    tentativa.replaceChildren();
    elemento(tentativa, 'span', `${t('attempt')}: `);
    const horario = elemento(tentativa, 'time', resultado.ultimaTentativa);
    horario.dateTime = resultado.ultimaTentativa;
    const estado = resultado.estado === 'disponivel' ? 'available' : 'unavailable';
    status.dataset.i18n = `reading.${estado}`;
    status.textContent = t(estado);
    conteudo.replaceChildren();
    if (resultado.estado !== 'disponivel') return;
    mostrarDados(conteudo, forma, resultado.dados, t);
    if (forma === 'registros') {
      const entrada = painel.querySelector('#public-notary-hash');
      const botao = painel.querySelector('#public-notary-query');
      const saida = painel.querySelector('[data-reading-result]');
      entrada.disabled = false;
      botao.disabled = false;
      botao.addEventListener('click', () => {
        const busca = buscarHash(resultado.dados, entrada.value.trim());
        saida.replaceChildren();
        if (busca.estado === 'encontrado') mostrarDados(saida, 'registros', { registros: [busca.registro] }, t);
        else saida.textContent = t(busca.estado === 'invalido' ? 'invalidHash' : 'notFound');
      });
    }
  }));
}
