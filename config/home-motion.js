import { languagePath } from './routes.js';
import { networks } from './catalogo-redes.js';

const text = (key, tag = 'p', classes = '') => `<${tag} class="${classes}" data-i18n="motion.${key}"></${tag}>`;
const counterArt = id => `<div class="counter-art" aria-hidden="true">${id === 'volume' ? '<svg viewBox="0 0 240 80" fill="none"><path d="M0 64H240" stroke="currentColor" stroke-dasharray="4 8"/><path d="M8 52C48 52 48 20 88 20S136 52 168 36S208 20 232 20" stroke="currentColor" stroke-width="2"/></svg>' : id === 'wallets' ? '<div class="counter-globe"></div>' : '<div class="counter-assets"><span>MTC</span><span>OHR</span></div>'}</div>`;
const status = () => '<span class="status-badge" data-i18n="status.deployment"></span>';
const heading = (title, desc) => `<div class="section-heading">${text(title, 'h2')}${text(desc)}</div>`;
const illustration = kind => `<div class="market-art art-${kind}" aria-hidden="true"><i></i><i></i><i></i><span>${kind === 'pair' ? 'MTC / USDT' : kind === 'chain' ? 'MTC' : 'MTC · OHR'}</span></div>`;

export function renderNetworkMovement() {
  return `<section id="como-a-rede-se-move" class="b-section network-movement" data-home-readings><div class="site-container">${heading('network.title', 'network.desc')}<dl class="network-counters">${['volume', 'wallets', 'assets'].map(id => `<div class="network-counter" data-network-counter="${id}">${text(`counter.${id}`, 'dt')}<dd><strong><span data-counter-value aria-hidden="true">—</span><span class="sr-only" data-counter-accessible>—</span></strong><p data-counter-status data-i18n="status.deployment"></p>${text(`counter.${id}.scope`, 'p', 'counter-scope')}${counterArt(id)}</dd></div>`).join('')}</dl></div></section>`;
}

function assetCard(name, role) {
  return `<li class="asset-card"><span class="asset-monogram" aria-hidden="true">${name === 'MTC' ? 'M' : name === 'OHR' ? 'O' : '◇'}</span><div><h3><bdi>${name}</bdi></h3>${text(role, 'p', 'asset-role')}</div><div class="asset-reading"><span${name === 'MTC' ? ' data-mtc-price' : ''}>—</span>${status()}</div></li>`;
}
export function renderMarkets(language) {
  const cards = [
    ['pair', 'app-cotacao'], ['chain', 'app-dashboard'], ['multi', 'app-multi-rede'],
  ];
  const assets = [ ['MTC', 'asset.token'], ['OHR', 'asset.gas'], ['MutualChain', 'asset.network'], ['MutualChain Testnet', 'asset.testnet'], ...networks.map(name => [name, 'asset.catalogue']) ];
  const columns = [assets.filter((_, i) => i % 2 === 0), assets.filter((_, i) => i % 2 !== 0)];
  return `<section id="negocie-entre-mercados" class="b-section markets-section"><div class="site-container">${heading('markets.title', 'markets.desc')}<div class="token-stage" aria-hidden="true"><div class="mtc-token">MTC</div><div class="token-pedestal"></div></div><div class="market-tabs" role="tablist" data-i18n-aria-label="motion.markets.title">${['mtc','chain','multi'].map((id,i)=>`<button type="button" id="market-tab-${id}" role="tab" aria-controls="market-panel-${id}" aria-selected="${i===0}" tabindex="${i===0?0:-1}" data-i18n="shield.tab.${id}"></button>`).join('')}</div><div class="market-bento">${cards.map(([id, page],i) => `<div role="tabpanel" tabindex="0" id="market-panel-${['mtc','chain','multi'][i]}" aria-labelledby="market-tab-${['mtc','chain','multi'][i]}"><a class="market-card market-card-${id}" href="${languagePath(language, page)}">${illustration(id)}<div class="market-card-copy">${text(`market.${id}.title`, 'h3')}${text(`market.${id}.desc`)}${status()}${text('markets.partner', 'p', 'supporting-note')}${text('markets.disabled', 'p', 'supporting-note')}${text('markets.open', 'span', 'market-link')}</div></a></div>`).join('')}</div><div class="asset-section-heading">${text('assets.title', 'h3')}${text('assets.desc')}<button type="button" class="asset-motion-toggle" aria-pressed="false" data-i18n="motion.pause" hidden></button></div><div class="asset-columns">${columns.map((items, i) => `<div class="asset-window" data-direction="${i ? 'down' : 'up'}"><div class="asset-track"><ul class="asset-list" role="list">${items.map(([name, role]) => assetCard(name, role)).join('')}</ul><ul class="asset-list asset-copy" role="list" aria-hidden="true" inert>${items.map(([name, role]) => assetCard(name, role)).join('')}</ul></div></div>`).join('')}</div></div></section>`;
}
