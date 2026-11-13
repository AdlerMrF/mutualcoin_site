import { languagePath } from './routes.js';
const text=(key,tag='p',classes='')=>`<${tag} class="${classes}" data-i18n="${key}"></${tag}>`;
// As respostas são as mesmas do conteúdo institucional existente, sem alegações novas.
export const faqEntries = [
  ['shield.faq.1.question','hero.desc'],
  ['shield.faq.2.question','position.2.desc'],
  ['shield.faq.3.question','price.empty'],
  ['shield.faq.4.question','shield.access.desc'],
];
const section=(id,body)=>`<section id="${id}" class="b-section shield-section"><div class="site-container">${body}</div></section>`;
export function renderTrust(){
  return section('por-que-nos-escolhem',`<div class="trust-arch" aria-hidden="true"><div></div></div><div class="section-heading">${text('shield.why.title','h2')}${text('shield.why.desc')}</div><div class="trust-grid">${[1,2,3,4].map(n=>`<article class="s-card content-card">${text(`shield.why.${n}.title`,'h3')}${text(`shield.why.${n}.desc`)}</article>`).join('')}</div>`);
}
export function renderFAQ(){
  return section('faq',`<div class="section-heading">${text('shield.faq.title','h2')}${text('shield.faq.desc')}</div><div class="faq-layout"><div>${faqEntries.map(([q,a],i)=>`<details class="faq-item"><summary id="faq-question-${i}" data-i18n="${q}"></summary><div role="region" aria-labelledby="faq-question-${i}">${text(a)}</div></details>`).join('')}</div><figure class="mascote-figure" data-mascote data-loaded="false" data-playing="false"><canvas width="480" height="420" role="img" data-i18n-aria-label="mascote.alt" aria-describedby="mascote-caption"></canvas><div class="mascote-controls"><button type="button" class="mascote-toggle story-toggle" aria-pressed="true" data-i18n-aria-label="video.play"><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24"><path class="play-icon" fill="currentColor" d="m8 5 11 7-11 7z"/><path class="pause-icon" fill="currentColor" d="M6 5h4v14H6zm8 0h4v14h-4z"/></svg></button></div><figcaption id="mascote-caption" data-i18n="mascote.caption"></figcaption></figure></div>`);
}
export function renderAccess(language){
  return section('acesse-de-onde-estiver',`<div class="access-layout"><div><div class="section-heading">${text('shield.access.title','h2')}${text('shield.access.desc')}</div><div class="hero-ctas"><a class="shiny-cta" href="${languagePath(language,'app')}">${text('shield.access.login','span')}</a><a class="ghost-cta" href="${languagePath(language,'contact')}">${text('shield.access.signup','span','ghost-text')}</a><a class="ghost-cta" href="${languagePath(language,'app-documentacao')}">${text('footer.developers','span','ghost-text')}</a></div></div><figure class="access-device"><div class="device-screen"><img src="/img/mutucoin-logo.svg" width="48" height="48" alt="" loading="lazy">${text('shield.access.web','p')}${text('status.deployment','p')}<span aria-hidden="true">MTC · MutualChain</span></div>${text('shield.access.illustration','figcaption')}</figure></div>`);
}
export function renderRiskDraft(){
  return section('document-divulgacao-risco',`<div class="legal-draft">${text('footer.risk','h2')}${text('governance.draft')}${text('governance.note')}${text('footer.scope')}</div>`);
}
