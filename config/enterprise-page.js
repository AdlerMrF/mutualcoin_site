import { languagePath } from './routes.js';
import { paymentRails } from './audiences.js';
import { visuals } from './visuals.js';

const text = (key, tag = 'p', className = '') => `<${tag} class="${className}" data-i18n="${key}"></${tag}>`;
const badge = (key = 'status.deployment') => text(key, 'span', 'status-badge');
const heading = (title, desc) => `<div class="section-heading">${text(title, 'h2')}${desc ? text(desc) : ''}</div>`;
const section = (id, body, classes = '') => `<section id="${id}" class="b-section ${classes}"><div class="site-container">${body}</div></section>`;

const sectors = ['government', 'finance', 'health', 'trade', 'critical'];
const controls = ['encryption', 'keys', 'access', 'privacy', 'audit', 'resilience'];
const roles = ['mutucoin', 'mutual', 'partner'];
const journey = [1, 2, 3, 4];
const trust = ['status', 'access', 'governance', 'report'];
const layers = ['applications', 'network', 'integration', 'governance'];
const services = [
  ['service-accounts', 'service-accounts.title', 'service-accounts.desc'],
  ['service-vault', 'service-vault.title', 'service-vault.desc'],
  ['service-liquidity', 'service-liquidity.title', 'service-liquidity.desc'],
  ['service-payments', 'service-payments.title', 'service-payments.desc'],
  ['service-exchange', 'service-exchange.title', 'service-exchange.desc'],
  ['service-wealth', 'service-wealth.title', 'service-wealth.desc'],
  ['service-institutional', 'service-institutional.title', 'service-institutional.desc'],
  ['service-ramp', 'service-ramp.title', 'service-ramp.desc'],
  ['service-treasury', 'service-treasury.title', 'service-treasury.desc'],
  ['service-api', 'service-api.title', 'service-api.desc'],
  ['blockchain', 'blockchain.title', 'blockchain.desc'],
  ['case-trade', 'case-trade.title', 'case-trade.desc'],
];

function enterpriseHero(language) {
  const chips = ['enterprise.control.encryption.title', 'enterprise.control.access.title', 'enterprise.control.privacy.title', 'service-ramp.title'];
  return `<section id="hero" class="site-hero enterprise-hero"><div class="enterprise-hero-grid" aria-hidden="true"></div><div class="site-container enterprise-hero-layout"><div class="hero-copy">${text('enterprise.eyebrow','span','hero-badge sec-eyebrow')}<h1 class="hero-title" data-i18n="enterprise.title"></h1>${text('enterprise.desc','p','hero-sub')}<div class="hero-ctas"><a class="shiny-cta" href="#demonstracao">${text('enterprise.demo.cta','span')}</a><a class="ghost-cta" href="#cobertura-global">${text('enterprise.coverage.title','span','ghost-text')}</a></div>${text('enterprise.hero.note','p','supporting-note')}</div><figure class="enterprise-vault" data-enterprise-scene aria-labelledby="enterprise-vault-caption"><div class="vault-stage" aria-hidden="true"><div class="vault-orbit"><span class="vault-ring vault-ring-one"></span><span class="vault-ring vault-ring-two"></span><span class="vault-ring vault-ring-three"></span><img src="/img/mutucoin-logo.svg" alt="" width="112" height="112"><i class="vault-node vault-node-one">D0</i><i class="vault-node vault-node-two">D1</i><i class="vault-node vault-node-three">PIX</i><i class="vault-node vault-node-four">MTC</i></div><div class="vault-route"><span>BRL</span><b></b><span>USD</span><b></b><span>EUR</span></div></div><ul>${chips.map(key=>`<li>${text(key,'span')}</li>`).join('')}</ul><figcaption id="enterprise-vault-caption" data-i18n="enterprise.vault.caption"></figcaption></figure></div><div class="site-container enterprise-proof-rail" aria-label="D0, D1, 200+"><div><strong>D0</strong>${text('enterprise.coverage.settlement','span')}</div><div><strong>200+</strong>${text('enterprise.coverage.metric','span')}</div><div><strong>D1</strong>${text('enterprise.coverage.note','span')}</div></div></section>`;
}

function demo() {
  const terminal=`<figure class="terminal-demo"><div class="terminal-demo-head"><div><span class="sec-eyebrow">MUTUAL TERMINAL</span></div></div><div class="terminal-demo-frame"><iframe src="http://127.0.0.1:4180/?embed=mutucoin" data-terminal-frame data-public-src="https://demonstracao.mutucoin.xyz/" title="Mutual Terminal: demonstração Mutucoin" referrerpolicy="no-referrer" sandbox="allow-scripts allow-same-origin"></iframe></div><figcaption>${text('enterprise.demo.note')}<a href="http://127.0.0.1:4180/?embed=mutucoin" data-terminal-link data-public-href="https://demonstracao.mutucoin.xyz/">Abrir a demonstração em tela cheia</a></figcaption></figure>`;
  return section('demonstracao', `${heading('enterprise.demo.title','app.desc')}${terminal}`, 'enterprise-demo-section');
}

export function renderEnterprise(language) {
  const sectorCards = sectors.map(id=>`<article class="enterprise-sector content-card">${text(`enterprise.sector.${id}.title`,'h3')}${text(`enterprise.sector.${id}.desc`)}</article>`).join('');
  const controlCards = controls.map(id=>`<article class="enterprise-control content-card">${badge('enterprise.option')}${text(`enterprise.control.${id}.title`,'h3')}${text(`enterprise.control.${id}.desc`)}</article>`).join('');
  const serviceCards = services.map(([page,title,desc])=>`<a class="enterprise-service content-card" href="${languagePath(language,page)}">${text(title,'h3')}${text(desc)}<span class="service-arrow" aria-hidden="true">→</span></a>`).join('');
  const roleCards = roles.map((id,index)=>`<article class="enterprise-role"><span class="enterprise-role-number" aria-hidden="true">0${index + 1}</span>${text(`enterprise.role.${id}.title`,'h3')}${text(`enterprise.role.${id}.desc`)}</article>`).join('');
  const journeySteps = journey.map(n=>`<li><span class="enterprise-journey-number" aria-hidden="true">0${n}</span>${text(`enterprise.journey.step${n}.title`,'h3')}${text(`enterprise.journey.step${n}.desc`)}</li>`).join('');
  const trustCards = trust.map(id=>`<article class="enterprise-trust-card content-card">${text(`enterprise.trust.${id}.title`,'h3')}${text(`enterprise.trust.${id}.desc`)}</article>`).join('');
  const layerCards = layers.map((id,index)=>`<li class="enterprise-layer"><span class="enterprise-layer-number" aria-hidden="true">0${index + 1}</span>${text(`enterprise.layer.${id}.title`,'h3')}${text(`enterprise.layer.${id}.desc`)}</li>`).join('');
  const institutionalCards = [
    ['service-vault.title','service-vault.desc'],
    ['service-liquidity.title','service-liquidity.desc'],
    ['enterprise.trust.report.title','enterprise.trust.report.desc'],
    ['enterprise.layer.network.title','enterprise.layer.network.desc'],
    ['enterprise.control.keys.title','enterprise.control.keys.desc'],
    ['enterprise.control.resilience.title','enterprise.control.resilience.desc'],
  ].map(([title,desc])=>`<article class="enterprise-control content-card">${text(title,'h3')}${text(desc)}</article>`).join('');
  const mascotCards = ['role', 'security', 'identity'].map(id=>`<article class="mascot-purpose-card">${text(`enterprise.mascot.${id}.title`,'h3')}${text(`enterprise.mascot.${id}.desc`)}</article>`).join('');
  const statusPage = section('status-operacional', `<div class="enterprise-status-card"><div class="enterprise-status-copy">${text('nav.status','span','sec-eyebrow')}${heading('status.title','status.desc')}${badge('status.unknown')}${text('state.desc','p','deployment-note')}</div><div class="enterprise-status-visual" aria-hidden="true"><span></span><span></span><span></span><span></span><b></b></div><a class="shiny-cta" href="${languagePath(language,'status')}">${text('nav.status','span')}</a></div>`, 'enterprise-status-section');
  return enterpriseHero(language)
    + section('setores', `${heading('enterprise.sectors.title','enterprise.sectors.desc')}<div class="enterprise-sector-grid">${sectorCards}</div>`)
    + section('responsabilidades', `${heading('enterprise.roles.title','enterprise.roles.desc')}<div class="enterprise-role-grid">${roleCards}</div>`, 'enterprise-roles')
    + section('cobertura-global', `<div class="enterprise-coverage"><div>${heading('enterprise.coverage.title','enterprise.coverage.desc')}<div class="coverage-metrics"><div class="coverage-metric settlement-metric"><strong>D0</strong>${text('enterprise.coverage.settlement','span')}</div><div class="coverage-metric"><strong>200+</strong>${text('enterprise.coverage.metric','span')}</div></div></div><div>${text('catalog.rails','h3','coverage-rails-title')}<ul class="enterprise-rail-list">${paymentRails.map(rail=>`<li><bdi>${rail.name}</bdi></li>`).join('')}</ul>${text('enterprise.coverage.note','p','deployment-note')}<div class="hero-ctas"><a class="ghost-cta" href="${languagePath(language,'case-trade')}">${text('case-trade.title','span','ghost-text')}</a></div></div></div>`, 'enterprise-coverage-section')
    + demo()
    + section('servicos-mutual', `${heading('enterprise.services.title','enterprise.services.desc')}<div class="enterprise-service-grid">${serviceCards}</div>${text('catalog.partner','p','supporting-note')}`)
    + section('protecao', `${heading('enterprise.security.title','enterprise.security.desc')}<div class="enterprise-control-grid">${controlCards}</div>${text('enterprise.security.limit','p','deployment-note')}`, 'enterprise-security')
    + section('infraestrutura-institucional', `${heading('enterprise.institutional.title','enterprise.institutional.desc')}<div class="enterprise-control-grid institutional-capabilities">${institutionalCards}</div>${text('catalog.partner','p','deployment-note')}`, 'enterprise-institutional')
    + section('arquitetura', `${heading('enterprise.layers.title','enterprise.layers.desc')}<ol class="enterprise-layer-grid">${layerCards}</ol>${text('enterprise.layers.note','p','deployment-note')}`, 'enterprise-layers')
    + section('rede-global', `<div class="enterprise-network-grid"><article><div>${heading('ecosystem.1.title','ecosystem.1.desc')}${badge()}</div>${visuals[1]}</article><article><div>${heading('ecosystem.2.title','ecosystem.2.desc')}${badge()}</div>${visuals[2]}</article></div>`, 'enterprise-network-section')
    + statusPage
    + section('transparencia', `${heading('enterprise.trust.title','enterprise.trust.desc')}<div class="enterprise-trust-grid">${trustCards}</div><div class="hero-ctas"><a class="ghost-cta" href="${languagePath(language,'governance')}">${text('enterprise.trust.governance.cta','span','ghost-text')}</a><a class="ghost-cta" href="${languagePath(language,'contact')}">${text('enterprise.trust.report.cta','span','ghost-text')}</a></div>`, 'enterprise-trust')
    + section('mascote-mutucoin', `<div class="enterprise-mascot-layout"><figure class="enterprise-mascot-figure"><img src="/img/mutucoin-mascot-3d.jpeg" width="1254" height="1254" loading="lazy" decoding="async" data-i18n-alt="enterprise.mascot.alt"><figcaption data-i18n="enterprise.mascot.caption"></figcaption></figure><div class="enterprise-mascot-copy">${heading('enterprise.mascot.title','enterprise.mascot.desc')}<div class="mascot-purpose-grid">${mascotCards}</div>${text('enterprise.mascot.note','p','deployment-note')}</div></div>`, 'enterprise-mascot-section')
    + section('jornada', `${heading('enterprise.journey.title','enterprise.journey.desc')}<ol class="enterprise-journey">${journeySteps}</ol>`, 'enterprise-journey-section')
    + section('enterprise-contact', `<div class="enterprise-final">${heading('enterprise.final.title','enterprise.final.desc')}<a class="shiny-cta" href="${languagePath(language,'contact')}">${text('case.cta','span')}</a></div>`);
}

export function enterpriseTeaser(language) {
  return section('infraestrutura-empresarial', `<div class="enterprise-teaser">${heading('enterprise.teaser.title','enterprise.teaser.desc')}<a class="ghost-cta" href="${languagePath(language,'enterprise')}">${text('enterprise.teaser.cta','span','ghost-text')}</a></div>`, 'enterprise-teaser-section');
}
