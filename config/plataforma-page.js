import { renderPublicReadings } from './leitura-page.js';
import { plataforma, platformPage, findPlatformPage } from './plataforma.js';
import { languagePath } from './routes.js';

const text = (key, tag = 'p', className = '') => `<${tag} class="${className}" data-i18n="${key}"></${tag}>`;
const badge = () => text('status.deployment', 'span', 'status-badge platform-status');
const partner = (item) => item.operacao_financeira ? text('app.partner', 'p', 'supporting-note') : '';
const groups = [
  ['services.modules', plataforma.filter(item => item.modulo)],
  ['services.integrations', plataforma.filter(item => !item.modulo)],
];
const hero = (title, desc) => `<section id="hero" class="site-hero page-hero"><div class="site-container"><div class="hero-copy">${text(title,'h1')}${text(desc,'p','hero-sub')}${badge()}</div></div></section>`;
const platformCard = (item, language) => `<article class="s-card content-card service-card" data-service-id="${item.id}"><h3><a href="${languagePath(language,platformPage(item))}" data-i18n="platform.${item.id}.title"></a></h3>${text(`platform.${item.id}.desc`)}${partner(item)}${badge()}</article>`;

export function servicesTeaser(language) {
  return `<section id="servicos" class="b-section services-teaser"><div class="site-container"><div class="section-heading">${text('services.home.title','h2')}${text('services.home.desc')}<div class="hero-ctas"><a class="ghost-cta" href="${languagePath(language,'services')}">${text('services.home.link','span','ghost-text')}</a></div></div></div></section>`;
}
export function renderServices(language) {
  return hero('services.title','services.desc')
    + groups.map(([title, items], index) => `<section id="services-${index}" class="b-section services-section"><div class="site-container"><div class="section-heading">${text(title,'h2')}</div><div class="b-grid">${items.map(item => platformCard(item, language)).join('')}</div></div></section>`).join('')
    + `<section id="ecosystem-services" class="b-section services-section"><div class="site-container"><div class="section-heading">${text('services.scope','h2')}</div><div class="b-grid">${['chain','reports','pix','vasp','payments'].map(id => `<article class="s-card content-card">${text(`services.${id}.title`,'h3')}${text(`services.${id}.desc`)}${badge()}</article>`).join('')}</div><div class="hero-ctas"><a class="ghost-cta" href="${languagePath(language,'app')}">${text('services.panel','span','ghost-text')}</a></div></div></section>`;
}
export function renderApp(language, page) {
  const current = findPlatformPage(page);
  const menu = `<nav class="app-navigation" data-i18n-aria-label="app.menu"><a class="app-menu-link" href="${languagePath(language,'app')}"${current ? '' : ' aria-current="page"'} data-i18n="app.overview"></a>${groups.map(([title, items]) => `<div class="app-menu-group">${text(title,'h2')}<ul role="list">${items.map(item => `<li><a class="app-menu-link" data-module-link="${item.id}" href="${languagePath(language,platformPage(item))}"${current?.id === item.id ? ' aria-current="page"' : ''} data-i18n="platform.${item.id}.title"></a></li>`).join('')}</ul></div>`).join('')}</nav>`;
  // Operações permanecem desligadas; as consultas públicas são acrescentadas ao conteúdo existente.
  const screen = current
    ? `<article id="module-${current.id}" class="module-screen" data-platform-screen="${current.id}" data-state="${current.estado}" data-move-valor="${current.move_valor}">${text('app.scope','p','sec-eyebrow')}${text(`platform.${current.id}.title`,'h1')}${text(`platform.${current.id}.desc`,'p','module-description')}${badge()}${current.move_valor ? text('app.disabled','p','operation-disabled') : ''}${partner(current)}${current.id === 'faucet' ? text('app.testnet','p','testnet-notice') : ''}${text('app.note','p','supporting-note')}${renderPublicReadings(current)}</article>`
    : `<div class="app-overview">${text('app.title','h1')}${text('app.desc','p','module-description')}${badge()}<div class="app-directory">${groups.map(([title, items]) => `<section>${text(title,'h2')}<ul role="list">${items.map(item => `<li><a href="${languagePath(language,platformPage(item))}" data-i18n="platform.${item.id}.title"></a></li>`).join('')}</ul></section>`).join('')}</div></div>`;
  return `<section class="app-shell"><div class="site-container"><aside class="app-network-strip" data-i18n="app.networks"></aside><div class="app-layout">${menu}<div class="app-content">${screen}</div></div><p class="app-network-facts" data-i18n="app.facts" dir="auto"></p></div></section>`;
}
