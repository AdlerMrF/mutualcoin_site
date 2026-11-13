import { consultarPublico } from './plataforma/leitura.js';
import { leituraPublica } from '../config/leitura-publica.js';

// Não existem caminhos públicos aprovados para volume nem carteiras ativas.
// O total de ativos é o total do registro, nunca quantidade de pares negociáveis.
export async function lerMovimentoPublico(consultar = consultarPublico) {
  const ler = async forma => {
    const caminho = leituraPublica.caminhos.find(item => item.forma === forma)?.caminho;
    if (!caminho) return null;
    try {
      const resultado = await consultar(caminho);
      return resultado?.estado === 'disponivel' ? resultado.dados : null;
    } catch { return null; }
  };
  const [ativos, preco] = await Promise.all([ler('ativos'), ler('preco')]);
  return {
    volume: null,
    wallets: null,
    assets: typeof ativos?.total === 'string' && /^(?:0|[1-9]\d*)$/.test(ativos.total) ? ativos.total : null,
    price: preco?.symbol === 'MTC' && typeof preco.usd === 'string' && /^(?:0|[1-9]\d*)(?:\.\d+)?$/.test(preco.usd) ? preco.usd : null,
  };
}

// Quantidades e preços permanecem exatos, inclusive acima do limite de inteiros
// do JavaScript. Apenas o tempo da animação usa a aritmética comum.
export function formatarNumeroPublico(valor, idioma) {
  if (valor === null) return '—';
  const [inteiro, fracao] = valor.split('.');
  const formatador = new Intl.NumberFormat(idioma, idioma === 'ar' ? { numberingSystem: 'arab' } : {});
  const separador = formatador.formatToParts(1.1).find(item => item.type === 'decimal').value;
  const digitos = fracao?.replace(/\d/g, digito => formatador.format(BigInt(digito)));
  return formatador.format(BigInt(inteiro)) + (fracao === undefined ? '' : separador + digitos);
}

export function passoContador(valor, passo) {
  const [inteiro, fracao = ''] = valor.split('.');
  const escalado = BigInt(inteiro + fracao) * BigInt(Math.max(0, Math.min(1000, Math.round(passo)))) / 1000n;
  const texto = escalado.toString().padStart(fracao.length + 1, '0');
  return fracao ? texto.slice(0, -fracao.length) + '.' + texto.slice(-fracao.length) : texto;
}

export function mostrarMovimentoPublico(doc, dados, { animar = () => {} } = {}) {
  const idioma = doc.documentElement.lang;
  const copia = JSON.parse(doc.getElementById('runtime-copy').textContent);
  for (const painel of doc.querySelectorAll('[data-network-counter]')) {
    const valor = dados[painel.dataset.networkCounter] ?? null;
    const tela = painel.querySelector('[data-counter-value]');
    tela.textContent = formatarNumeroPublico(valor, idioma);
    painel.querySelector('[data-counter-accessible]').textContent = tela.textContent;
    painel.querySelector('[data-counter-status]').textContent = copia[valor === null ? 'motion.deployment' : 'motion.public'];
    painel.dataset.counterState = valor === null ? 'pending' : 'available';
    if (valor !== null && BigInt(valor.replace('.', '')) > 0n) animar(tela, valor, idioma);
  }
  for (const tela of doc.querySelectorAll('[data-mtc-price]')) {
    tela.textContent = dados.price === null ? '—' : `${formatarNumeroPublico(dados.price, idioma)} USD / MTC`;
    tela.parentElement.querySelector('.status-badge').textContent = copia[dados.price === null ? 'motion.deployment' : 'motion.public'];
  }
}
