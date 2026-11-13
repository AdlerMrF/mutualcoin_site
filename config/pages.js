import { readFileSync } from 'node:fs';
import { visuals } from './visuals.js';
import { navigationPages, languagePath } from './routes.js';
import { renderGovernanceDocuments } from './governance-page.js';
import { renderTrust, renderFAQ, renderAccess, renderRiskDraft } from './blindagem.js';
import { plataforma, findPlatformPage } from './plataforma.js';
import { renderApp, renderServices, servicesTeaser } from './plataforma-page.js';
import { renderNetworkMovement, renderMarkets } from './home-motion.js';
import { networks } from './catalogo-redes.js';
import { needsSection } from './needs.js';
import { audiences, catalogue, useCases } from './audiences.js';
import { audienceNavigation, infrastructureHero, horizon, motherboard, renderCatalogue, audienceCards, caseCards, productBands, featureGrid, finalCTA, renderAudience, renderService, renderCase } from './catalogue-page.js';
import { publicPreview } from './public-preview.js';
import { renderEnterprise, enterpriseTeaser } from './enterprise-page.js';

const header = readFileSync(new URL('./header.html', import.meta.url), 'utf8').replaceAll('./src/assets/img/iconeMutual.svg', '/img/mutucoin-logo.svg');
const text = (key, tag = 'p', className = '') => `<${tag} class="${className}" data-i18n="${key}"></${tag}>`;
const badge = (key = 'status.deployment') => text(key, 'span', 'status-badge');
const heading = (title, desc) => `<div class="section-heading">${text(title, 'h2')}${desc ? text(desc) : ''}</div>`;
const card = (title, desc) => `<article class="s-card content-card">${text(title, 'h3')}${text(desc)}</article>`;
const section = (id, body, classes = '') => `<section id="${id}" class="b-section ${classes}"><div class="site-container">${body}</div></section>`;
const legalIdentity = () => `<address class="legal-identity" dir="ltr">${text('legal.company')}${text('legal.tax')}${text('legal.address')}</address>`;
const positioning = () => section('aviso-legal', `${heading('position.title','position.desc')}<div class="b-grid three-columns">${[1,2,3].map(n=>`<article class="s-card content-card"><span class="manifesto-number" aria-hidden="true">0${n}</span>${text(`position.${n}.title`,'h3')}${text(`position.${n}.desc`)}</article>`).join('')}</div>`, 'legal-positioning');
const contactHistory = () => `<details class="contact-history"><summary data-i18n="shield.contact.history"></summary>${text('contact.email')}${text('contact.login')}</details>`;
const contactChannels = () => `<div class="contact-channels">${text('shield.contact.confirmed')}<div>${['suporte@mutualcapital.org','contato@mutualcapital.org','juridico@mutualcapital.org'].map(email=>`<a href="mailto:${email}"><bdi>${email}</bdi></a>`).join('')}</div></div>`;
const rails = ['Pix', 'SPEI', 'FPS', 'UPI', 'Faster Payments', 'FedNow', 'TIPS'];

export function navigation(language, page, mobile = false, grouped = false) {
  const active = findPlatformPage(page) ? 'app' : page;
  const link = id => `<a href="${languagePath(language, id)}" class="${mobile ? 'mobile-menu-link' : 'nav-link'}"${id === active ? ' aria-current="page"' : ''} data-i18n="nav.${id}"></a>`;
  if (publicPreview) return `<nav class="${mobile ? 'flex flex-col p-2' : 'desktop-navigation'}" data-i18n-aria-label="nav.label">${['blockchain','enterprise','services','governance','contact',...(mobile ? ['home'] : [])].map(link).join('')}</nav>`;
  const platform = ['onchain','wallets','blockchain','vasp','hub','ecosystem','status','prices','services','app'];
  if (grouped) return audienceNavigation(language,page,mobile,`<details class="platform-navigation"><summary data-i18n="nav.platform"></summary><div class="platform-links">${['home',...platform,'governance'].map(link).join('')}</div></details>`);
  const links = Object.keys(navigationPages).map(link).join('');
  return `<nav class="${mobile ? 'flex flex-col p-2' : 'desktop-navigation'}" data-i18n-aria-label="nav.label">${links}</nav>`;
}
export function renderHeader(language, page) {
  const template = publicPreview ? header
    .replace(/<div class="header-account-actions">[\s\S]*?<\/div>/, '')
    .replace(/<a href="\{\{app\}\}" class="mobile-menu-link" data-i18n="shield.access.login"><\/a>/, '')
    .replace(/<a href="\{\{contact\}\}" class="mobile-menu-link" data-i18n="shield.access.signup"><\/a>/, '') : header;
  return template.replace('{{desktop-nav}}', navigation(language, page, false, true))
    .replace('{{mobile-nav}}', navigation(language, page, true, true))
    .replaceAll('{{app}}', languagePath(language, 'app'))
    .replaceAll('{{home}}', languagePath(language))
    .replaceAll('{{contact}}', languagePath(language, 'contact'));
}
export function renderFooter(language, page) {
  const link=(key,href)=>`<a href="${href}" data-i18n="${key}"></a>`;
  const column=(key,body)=>`<details class="footer-column" open><summary data-i18n="${key}"></summary><div class="footer-column-body">${body}</div></details>`;
  const governance=languagePath(language,'governance');
  const serviceLinks = ['blockchain','enterprise','services','ecosystem','onchain','status']
    .map(id=>link(`nav.${id}`,languagePath(language,id))).join('');
  return `<footer class="site-footer" data-i18n-aria-label="footer.label"><div class="site-container footer-brand"><a class="footer-logo" href="${languagePath(language)}"><img src="/img/mutucoin-logo.svg" alt="" width="36" height="36"><span>Mutucoin</span></a>${text('footer.desc')}${text('position.motto')}${text('execution.note')}</div><div class="site-container footer-layout">${column('footer.legal',link('footer.about',`${languagePath(language,'contact')}#aviso-legal`)+link('footer.useTerms',`${governance}#document-termos-uso-title`)+link('footer.privacy',`${governance}#document-privacidade-lgpd-title`)+link('footer.risk',`${governance}#document-divulgacao-risco`)+link('nav.governance',governance)+text('footer.terms'))}${column('footer.services',serviceLinks+`<details class="footer-site-map"><summary data-i18n="ecosystem.title"></summary>${navigation(language,page)}</details>`)}${column('footer.support',link('nav.status',languagePath(language,'status'))+link('nav.contact',languagePath(language,'contact'))+link('shield.faq.title',`${languagePath(language)}#faq`))}${column('nav.contact',['suporte@mutualcapital.org','contato@mutualcapital.org','juridico@mutualcapital.org'].map(email=>`<a href="mailto:${email}"><bdi>${email}</bdi></a>`).join('')+contactHistory())}${column('language.label',`<label for="footer-language-select" data-i18n="language.label"></label><select id="footer-language-select" data-language-select>${['pt-BR','en','es','de','it','ja','ar'].map(lang=>`<option value="${lang}" data-i18n="language.${lang}"></option>`).join('')}</select>`)}</div><div class="site-container footer-bottom">${text('footer.rights')}${legalIdentity()}${text('footer.scope')}${text('footer.note')}${text('local')}</div></footer>`;
}
function contact() {
  return section('contato', `<div class="contact-panel reveal">${heading('contact.title','contact.desc')}${badge('status.pending')}${contactChannels()}${text('contact.identity')}${legalIdentity()}${contactHistory()}</div>`);
}
function downloads() {
  return section('downloads', `${heading('downloads.title','downloads.desc')}<ul class="download-list">${['whitepaper','terms','privacy','network'].map((key) => `<li>${text(`downloads.${key}`,'h3')}<div>${text('downloads.version','span')}${badge('status.pending')}</div></li>`).join('')}</ul>`);
}
function governanceTeaser(language) {
  return section('documentos', `${heading('governance.home.title','governance.home.desc')}<div class="hero-ctas"><a class="ghost-cta" href="${languagePath(language,'governance')}">${text('governance.home.link','span','ghost-text')}</a></div>`, 'governance-teaser');
}
function ecosystemCards(language) {
  // Expansão nativa: todo o texto permanece no HTML, com acesso por teclado.
  return `<div class="network-groups">${[rails,networks].map((items, group) => `<details class="network-group"${group === 0 ? ' open' : ''}><summary>${text(`ecosystem.${group+1}.title`,'h3')}</summary><div class="network-grid">${items.map(name => `<a class="sol-card network-node" href="${languagePath(language,'ecosystem')}#${group === 0 ? 'payment-rails' : 'digital-networks'}"><h4 dir="auto">${name}</h4>${text(group === 0 ? 'rail.label' : 'network.label','p','node-role')}${badge()}</a>`).join('')}</div></details>`).join('')}</div>`;
}
function hero(language) {
  return `<section id="hero" class="site-hero"><div class="hero-earth-wrap" aria-hidden="true"><img class="hero-earth" src="/img/hero-earth.webp" alt="" width="1440" height="984"></div><div class="hero-squares" aria-hidden="true"></div><div class="site-container hero-layout"><div class="hero-copy">${text('hero.eyebrow','span','hero-badge sec-eyebrow')}<h1 class="hero-title" id="hero-heading">${[1,2,3].map((n)=>text(`hero.line${n}`,'span','hero-line')).join('')}</h1>${text('hero.desc','p','hero-sub')}<div class="hero-chips">${['MutualChain','MTC','Mutual Hub'].map(name=>`<span class="hero-chip"><i aria-hidden="true"></i>${name} · <span data-i18n="status.deployment"></span></span>`).join('')}</div><div class="hero-ctas"><a class="shiny-cta" href="${languagePath(language,'blockchain')}">${text('cta.explore','span')}</a><a class="ghost-cta" href="${languagePath(language,'ecosystem')}">${text('cta.ecosystem','span','ghost-text')}</a></div>${text('hero.note','p','hero-auth supporting-note')}</div>${visuals[0]}</div>${text('hero.layer','p','hero-layer')}</section>`;
}
function institutionalHero(language) {
  const nodes = [['Pix','MTC'],['crypto','OHR'],['fx','EVM'],['vault','nav.onchain'],['onboarding','nav.wallets'],['payments','purpose.notary.title']];
  const graphic = `<figure class="orchestration-figure release-network" data-circuit-motion><div class="orchestration-board"><svg class="orchestration-trails" viewBox="0 0 640 440" aria-hidden="true" focusable="false">${['M320 220H140V65','M320 220V65','M320 220H500V65','M320 220H140V375','M320 220V375','M320 220H500V375'].map(d=>`<path class="circuit-base" d="${d}"/><path class="circuit-pulse" d="${d}"/>`).join('')}</svg><div class="mutual-core"><img src="/img/mutucoin-logo.svg" alt="" width="56" height="56"><span>MutualChain</span></div><ul class="circuit-modules">${nodes.map(([id,label])=>`<li class="circuit-chip circuit-${id}">${label.includes('.')?text(label,'span'):`<span>${label}</span>`}</li>`).join('')}</ul></div>${text('video.concept','figcaption')}<button type="button" class="circuit-toggle" aria-pressed="false" data-i18n="orchestration.pause"></button></figure>`;
  return hero(language).replace(visuals[0],graphic);
}
function notary() {
  return section('mutual-cartorio', `${heading('notary.title','notary.desc')}${badge()}${text('notary.limit','p','deployment-note')}`);
}
function chainPurpose(language, teaser = false) {
  const action = (key, href) => `<a class="ghost-cta" href="${href}">${text(key,'span','ghost-text')}</a>`;
  if (teaser) return section('mutualchain-na-empresa', `<div class="chain-reading">${heading('purpose.title','purpose.teaser')}<div class="hero-ctas">${action('purpose.more',`${languagePath(language,'blockchain')}#para-que-serve`)}</div></div>`, 'chain-purpose');
  return section('para-que-serve', `<div class="chain-reading">${heading('purpose.title')}<div class="purpose-blocks">${[1,2,3,4,5].map(n=>`<article class="purpose-block">${text(`purpose.${n}.title`,'h3')}${text(`purpose.${n}.desc`)}</article>`).join('')}</div><aside id="mutual-cartorio" class="purpose-notary" aria-labelledby="purpose-notary-title"><h3 id="purpose-notary-title" data-i18n="purpose.notary.title"></h3>${badge()}${text('purpose.notary.desc')}${text('notary.limit','p','supporting-note')}</aside><div class="purpose-contact">${text('purpose.question')}<div class="hero-ctas">${action('purpose.contact',languagePath(language,'contact'))}</div></div></div>`, 'chain-purpose');
}
function titleKey(page) { const item = findPlatformPage(page); return item ? `platform.${item.id}.title` : page === 'contact' ? 'contact.page.title' : `${page}.title`; }
function descKey(page) { const item = findPlatformPage(page); return item ? `platform.${item.id}.desc` : page === 'contact' ? 'contact.page.desc' : `${page}.desc`; }
export { titleKey, descKey };

export function renderPage(language, page) {
  if (page === 'home' && publicPreview) return institutionalHero(language)
    + chainPurpose(language, true)
    + enterpriseTeaser(language)
    + servicesTeaser(language)
    + section('ecosystem', `${heading('ecosystem.title','ecosystem.desc')}<div class="ecosystem-intro">${visuals[2]}<div>${badge()}${text('hero.note')}</div></div>${ecosystemCards(language)}`)
    + renderTrust() + renderFAQ() + needsSection + contact() + downloads() + governanceTeaser(language);
  if (audiences.some(a=>a.id===page)) return renderAudience(language,page);
  if (catalogue.some(s=>s.page===page)) return renderService(language,page);
  if (useCases.some(c=>c.page===page)) return renderCase(language,page);
  if (page === 'app' || findPlatformPage(page)) return renderApp(language, page);
  if (page === 'services') return renderServices(language) + renderCatalogue(language) + caseCards(language) + finalCTA(language);
  if (page === 'enterprise') return renderEnterprise(language);
  if (page === 'home') return renderEnterprise(language) + governanceTeaser(language) + renderFAQ() + contact();

  if (page === 'governance') return `<section id="hero" class="site-hero page-hero"><div class="site-container"><div class="hero-copy"><h1 data-i18n="governance.title"></h1>${text('governance.desc','p','hero-sub')}</div></div></section>` + renderGovernanceDocuments(language) + renderRiskDraft();

  let html = `<section id="hero" class="site-hero page-hero"><div class="site-container"><div class="hero-copy">${text(`nav.${page}`,'span','hero-badge sec-eyebrow')}<h1 class="hero-line" data-i18n="${titleKey(page)}"></h1>${text(descKey(page),'p','hero-sub')}${badge()}</div></div></section>`;
  if (page === 'contact') return html + positioning() + contact() + downloads();
  if (page === 'blockchain') html += chainPurpose(language);
  html += section('overview', `<div class="b-grid">${card(`${page}.1.title`,`${page}.1.desc`)}${card(`${page}.2.title`,`${page}.2.desc`)}</div>`);
  if (page === 'onchain') html += section('reports', `${text('report.empty','p','empty-state')}${heading('fields.title','fields.desc')}`) + notary();
  if (page === 'wallets') html += section('ownership', text('wallet.empty','p','empty-state'));
  if (page === 'blockchain') {
    const params = [['main','28001'],['test','28002'],['compatibility','EVM'],['consensus','Clique PoA'],['gas','OHR'],['token','MTC · MTCR-20'],['decimals','6']];
    html += section('chain-parameters', `<div class="chain-layout">${visuals[0]}<div>${badge('status.reference')}<dl class="chain-params">${params.map(([key,value])=>`<div>${text(`chain.${key}`,'dt')}<dd><bdi>${value}</bdi></dd></div>`).join('')}<div class="contract">${text('chain.contract','dt')}<dd><code dir="ltr">0x570a45578aeC7C4AE67Bb1A8774a818300D4C513</code></dd></div></dl>${text('chain.note','p','supporting-note')}${text('chain.explorer','p','empty-state')}</div></div>`);
  }
  if (page === 'vasp') html += section('institutional-scope', text('vasp.note','p','deployment-note'));
  if (page === 'hub') html += section('hub-scope', text('hub.note','p','deployment-note'));
  if (page === 'ecosystem') html += section('payment-rails', `<div class="editorial-layout"><div>${heading('ecosystem.1.title','ecosystem.1.desc')}${badge()}</div>${visuals[1]}</div>`, 'corridor-section')
    + section('digital-networks', `<div class="editorial-layout"><div>${heading('ecosystem.2.title','ecosystem.2.desc')}${badge()}</div>${visuals[2]}</div>${ecosystemCards(language)}`);
  if (page === 'status') html += section('network-status', `${text('state.desc','p','deployment-note')}<div class="status-table-wrap"><table><caption data-i18n="status.title"></caption><thead><tr>${['component','reading','updated'].map(key=>text(`state.${key}`,'th')).join('')}</tr></thead><tbody>${['MutualChain · 28001','MutualChain · 28002','Mutual On-Chain','Mutual Carteiras','Mutual Hub',...networks].map(name=>`<tr><th scope="row"><bdi>${name}</bdi></th>${text('status.unknown','td')}${text('state.none','td')}</tr>`).join('')}</tbody></table></div>`);
  if (page === 'prices') html += section('market', `${text('price.empty','p','empty-state')}${['ticker-tape','market-overview'].map(kind=>`<figure class="market-widget"><div class="widget-slot" data-tradingview="${kind}">${text('market.loading')}</div><figcaption><a href="https://www.tradingview.com/markets/" target="_blank" rel="noopener noreferrer nofollow">Powered by TradingView</a>${kind==='ticker-tape'?'<button type="button" class="widget-pause" disabled aria-pressed="false" data-i18n="market.pause"></button>':''}</figcaption></figure>`).join('')}${text('market.note','p','supporting-note')}`);
  if (page !== 'blockchain') html += section('next-step', `<a class="ghost-cta" href="${languagePath(language,'contact')}">${text('cta.contact','span','ghost-text')}</a>`);
  return html;
}
