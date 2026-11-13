import { languagePath } from './routes.js';
import { audiences, catalogue, useCases, paymentRails, homeSectionsByAudience } from './audiences.js';

const text=(key,tag='p',className='')=>`<${tag} class="${className}" data-i18n="${key}"></${tag}>`;
const section=(id,body,classes='')=>`<section id="${id}" class="b-section catalogue-section ${classes}"><div class="site-container">${body}</div></section>`;
const heading=(title,desc)=>`<div class="section-heading">${text(title,'h2')}${desc?text(desc):''}</div>`;
const link=(language,page,key,classes='ghost-cta',hash='')=>`<a class="${classes}" href="${languagePath(language,page)}${hash?`#${hash}`:''}">${text(key,'span')}</a>`;
const partner=()=>text('catalog.partner','p','catalogue-qualification');
const cta=(language)=>`<div class="hero-ctas">${link(language,'contact','catalog.specialist','shiny-cta')}</div>`;
export function menuCopy(item){
  const modules={wallet:'carteira-multi-rede',swap:'mtcswap',miles:'milhas'};
  if(modules[item.id])return [`platform.${modules[item.id]}.title`,`platform.${modules[item.id]}.desc`];
  if(item.id==='fintech')return ['mega.fintech.title','case.fintech.desc'];
  if(catalogue.some(service=>service.id===item.id))return [`${['accounts','vault','liquidity','treasury','exchange','institutional','wealth'].includes(item.id)?'mega':'catalog'}.${item.id}.title`,`catalog.${item.id}.desc`];
  return [`mega.${item.id}.title`,`mega.${item.id}.desc`];
}
export function audienceNavigation(language,page,mobile=false,legacy=''){
  const prefix=mobile?'mobile':'desktop';
  return `<nav class="${mobile?'audience-mobile-navigation':'desktop-navigation audience-navigation'}" data-i18n-aria-label="nav.label">${audiences.map(a=>{
    const id=`${prefix}-door-${a.id}`;
    return `<div class="audience-door" data-audience-door="${a.id}"><button type="button" class="audience-trigger" id="${id}-trigger" aria-expanded="false" aria-controls="${id}" data-i18n="audience.${a.id}.title"></button><div id="${id}" class="mega-panel" role="region" aria-labelledby="${id}-trigger" hidden><div class="mega-content">${text(`audience.${a.id}.label`,'p','mega-eyebrow')}${link(language,a.id,'catalog.portal','mega-portal')}${a.items.map(item=>{const [title,desc]=menuCopy(item);return `<a class="mega-item" href="${languagePath(language,item.page)}${item.hash?`#${item.hash}`:''}">${text(title,'strong')}${text(desc,'span')}</a>`;}).join('')}${a.id==='structure'?legacy:''}</div><aside class="mega-card">${text(`audience.${a.id}.card`,'p')}${partner()}${cta(language)}</aside><button class="mega-close" type="button" data-close-door data-i18n="catalog.close"></button></div></div>`;
  }).join('')}${link(language,'contact','nav.contact',mobile?'mobile-menu-link':'nav-link')}${mobile?link(language,'home','nav.home','mobile-menu-link'):''}</nav>`;
}

const modules=[['Pix','Pix'],['crypto','orchestration.crypto'],['fx','orchestration.fx'],['vault','orchestration.vault'],['onboarding','orchestration.onboarding'],['payments','orchestration.payments']];
const circuitTracks=(paths,viewBox='0 0 640 440',className='orchestration-trails')=>`<svg viewBox="${viewBox}" aria-hidden="true" focusable="false" class="${className}">${paths.map(d=>`<path class="circuit-base" d="${d}"/><path class="circuit-pulse" d="${d}"/>`).join('')}</svg>`;
const trails=circuitTracks(['M320 220H140V65','M320 220V65','M320 220H500V65','M320 220H140V375','M320 220V375','M320 220H500V375']);
export function orchestration(kind='core'){
  return `<figure class="orchestration-figure orchestration-3d" data-circuit-motion><div class="orchestration-board ${kind==='motherboard'?'motherboard':''}"><div class="scene-aura" aria-hidden="true"></div><div class="scene-grid" aria-hidden="true"></div><div class="scene-orbit scene-orbit-a" aria-hidden="true"><i></i><i></i><i></i></div><div class="scene-orbit scene-orbit-b" aria-hidden="true"><i></i><i></i></div>${trails}<div class="mutual-core"><span class="core-halo" aria-hidden="true"></span><img src="/img/mutucoin-logo.svg" alt="" width="56" height="56"><span>Mutual</span><small>MutualChain</small></div><ul class="circuit-modules">${modules.map(([id,key])=>`<li class="circuit-chip circuit-${id}"><span class="chip-icon" aria-hidden="true">◇</span>${id==='Pix'?'<span>Pix</span>':text(key,'span')}</li>`).join('')}</ul></div>${text('catalog.illustration','figcaption')}<button type="button" class="circuit-toggle" aria-pressed="false" data-i18n="orchestration.pause"></button></figure>`;
}
export function infrastructureHero(language){
  return `<section id="infraestrutura" class="site-hero orchestration-hero catalogue-section"><div class="site-container orchestration-layout"><div class="hero-copy">${text('catalog.motto','p','sec-eyebrow')}<h1>${text('orchestration.title','span')}${text('orchestration.accent','span','orchestration-accent')}</h1>${text('orchestration.desc','p','hero-sub')}<div class="hero-ctas">${link(language,'business','nav.business','shiny-cta')}${link(language,'services','catalog.explore')}</div>${partner()}</div>${orchestration()}</div></section>`;
}
export function horizon(language){return section('horizonte',`${heading('orchestration.horizon')}${cta(language)}<div class="horizon-art" aria-hidden="true"><div></div></div>`,'horizon-section');}
export function motherboard(){return section('modulos-conectados',`${heading('orchestration.modules')}${orchestration('motherboard')}`);}
function serviceCard(language,id){const s=catalogue.find(s=>s.id===id);return `<article class="s-card content-card catalogue-card" data-catalogue-service="${id}">${text(`catalog.${id}.title`,'h3')}${text(`catalog.${id}.desc`)}${partner()}${link(language,s.page,'catalog.explore','catalogue-link')}</article>`;}
export function renderCatalogue(language,ids=catalogue.map(s=>s.id)){
  return section('catalogo-unificado',`${heading('catalog.title','catalog.desc')}${text('catalog.motto','p','catalogue-motto')}${text('catalog.integration.pending','p','supporting-note')}<div class="catalogue-grid">${ids.map(id=>serviceCard(language,id)).join('')}</div>`);
}
export function audienceCards(language){return section('portas',`${heading('catalog.journey','catalog.journey.desc')}<div class="audience-grid">${audiences.map(a=>`<article class="s-card content-card">${text(`audience.${a.id}.title`,'h3')}${text(`audience.${a.id}.desc`)}${link(language,a.id,'catalog.portal','catalogue-link')}</article>`).join('')}</div>`);}
export function caseCards(language){return section('casos-de-uso',`${heading('case.title','case.desc')}<div class="catalogue-grid case-grid">${useCases.map(c=>`<article class="s-card content-card" data-use-case="${c.id}">${text(`case.${c.id}.title`,'h3')}${text(`case.${c.id}.desc`)}${partner()}${link(language,c.page,'catalog.portal','catalogue-link')}</article>`).join('')}</div>`);}
export function safety(){return section('security',`${heading('safety.title')}<div class="safety-layout"><div>${text('safety.current','h3')}<ul class="safety-list">${['keys','kyb','2fa'].map(id=>`<li>${text(`safety.${id}`)}</li>`).join('')}</ul></div><div class="safety-pending">${text('status.deployment','h3')}${text('safety.pending')}${text('catalog.vault.desc')}</div></div>`);}
export function rails(){return section('trilhos-disponiveis',`${heading('catalog.rails','catalog.timing')}<div class="rails-grid">${paymentRails.map(r=>`<article class="rail-card" data-rail="${r.id}" data-availability="available"><h3><bdi>${r.name}</bdi></h3><p><bdi>${r.assets}</bdi></p>${text('catalog.available','p','rail-available')}</article>`).join('')}</div>${text('catalog.rails.note','p','supporting-note')}`);}
export function finalCTA(language,label='catalog.specialist'){return section('fale-com-especialista',`${heading('catalog.final','catalog.motto')}${partner()}<div class="hero-ctas">${link(language,'contact',label,'shiny-cta')}</div>`,'catalogue-final');}
function pageHero(title,desc){return `<section id="hero" class="site-hero page-hero"><div class="site-container"><div class="hero-copy">${text('catalog.motto','p','sec-eyebrow')}${text(title,'h1')}${text(desc,'p','hero-sub')}${partner()}</div></div></section>`;}
export function renderAudience(language,id){
  const a=audiences.find(a=>a.id===id);
  let html=pageHero(`audience.${id}.title`,`audience.${id}.desc`);
  html+=section('nesta-porta',`${heading(`audience.${id}.label`)}<div class="catalogue-grid">${a.items.map(item=>{const [title,desc]=menuCopy(item);return `<article class="s-card content-card">${text(title,'h3')}${text(desc)}${partner()}${link(language,item.page,'catalog.portal','catalogue-link',item.hash)}</article>`;}).join('')}</div>`);
  html+=renderCatalogue(language,a.services);
  if(id==='business')html+=caseCards(language)+rails();
  if(id==='partners')html+=section('perfis-de-parceria',`${heading('partners.profiles')}<div class="catalogue-grid">${[['integrators','api'],['issuers','institutional']].map(([profile,service])=>`<article class="s-card content-card">${text(`partners.${profile}.title`,'h3')}${text(`partners.${profile}.desc`)}${partner()}${text('catalog.integration.pending')}${link(language,`service-${service}`,'catalog.portal','catalogue-link')}</article>`).join('')}</div>`)+section('join',`${heading('mega.join.title','mega.join.desc')}${text('audience.partners.card')}${cta(language)}`)+section('corporates',`${heading('mega.corporates.title','mega.corporates.desc')}${caseCardsBody(language)}`)+section('brokers',`${heading('mega.brokers.title','mega.brokers.desc')}${text('catalog.institutional.desc')}${cta(language)}`);
  if(id==='structure')html+=section('mutualchain',`${heading('mega.about.title')}${text('safety.chain','p','chain-reference')}${text('safety.chain.note')}${link(language,'blockchain','mega.about.title')}`)+safety();
  html+=section('plataforma-existente',`${heading('catalog.legacy')}<div class="existing-links">${a.extra.map(page=>link(language,page,page.startsWith('app-')?`platform.${page.slice(4)}.title`:`nav.${page}`,'catalogue-link')).join('')}${homeSectionsByAudience[id].map(([hash,key])=>link(language,'home',key,'catalogue-link',hash)).join('')}</div>`);
  return html+finalCTA(language);
}
function caseCardsBody(language){return `<div class="existing-links">${useCases.map(c=>link(language,c.page,`case.${c.id}.title`,'catalogue-link')).join('')}</div>`;}
export function renderService(language,page){
  const s=catalogue.find(s=>s.page===page);
  return pageHero(`catalog.${s.id}.title`,`catalog.${s.id}.desc`)+section('em-breve',`${heading('catalog.soon','catalog.soon.desc')}${text('status.deployment','p','status-badge')}${text('catalog.timing')}${cta(language)}<div class="hero-ctas">${link(language,s.module,'catalog.module')}${link(language,'services','catalog.explore')}</div>`)+safety()+finalCTA(language);
}
export function animatedFlow(id){return `<figure class="use-case-flow" data-circuit-motion>${circuitTracks(['M80 40H240','M240 40H400','M400 40H560'],'0 0 640 80','flow-trails')}<ol>${[1,2,3,4].map(n=>`<li><span class="flow-node" aria-hidden="true">${n===3?'◇':'○'}</span>${text(`case.${id}.flow${n}`,'p')}</li>`).join('')}</ol>${text('catalog.illustration','figcaption')}${text('catalog.timing')}<button type="button" class="circuit-toggle" aria-pressed="false" data-i18n="orchestration.pause"></button></figure>`;}
export function renderCase(language,page){
  const c=useCases.find(c=>c.page===page),id=c.id;
  return pageHero(`case.${id}.title`,`case.${id}.desc`)
    +section('desafio',`${heading('case.pain')}<ul class="pain-list">${[1,2,3].map(n=>`<li>${text(`case.${id}.pain${n}`)}</li>`).join('')}</ul>`)
    +section('fluxo',`${heading('case.flow')}${animatedFlow(id)}${['commerce','logistics'].includes(id)?text(`case.${id}.timing`):''}`)
    +section('recursos',`${heading('case.resources')}${id==='fintech'?text('case.fintech.controls'):''}<div class="catalogue-grid">${c.resources.map(resource=>serviceCard(language,resource)).join('')}</div>`)
    +section('para-quem',`${heading('case.who')}${text(`case.${id}.who`)}${text('case.regulated','h3')}${text('case.extra')}`)
    +safety()+rails()+finalCTA(language,'case.cta');
}
function mock(id,device=false){return `<figure class="operation-mock ${device?'feature-device':''}"><div class="mock-screen"><img src="/img/mutucoin-logo.svg" alt="" width="36" height="36" loading="lazy">${text(`band.${id}.title`,'p','mock-title')}${text('features.request')}<dl><div>${text('features.origin','dt')}<dd>BRL</dd></div><div>${text('features.destination','dt')}<dd>USD</dd></div></dl>${text('features.review','p','mock-state')}<div class="mock-lines" aria-hidden="true"><span></span><span></span><span></span></div></div>${text('catalog.illustration','figcaption')}</figure>`;}
export function productBands(){return ['reconciliation','returns','monitoring'].map((id,index)=>section(`operacao-${id}`,`<div class="product-band-layout"><div>${heading(`band.${id}.title`,`band.${id}.desc`)}${partner()}</div>${mock(id)}</div>`,index%2?'operation-band':'product-band')).join('');}
export function featureGrid(language){const ids=['api','accounts','payments','exchange','treasury','vault'];return section('recursos-conectados',`${heading('features.title')}<div class="features-layout"><div class="features-grid">${ids.map((id,n)=>`<article class="s-card content-card ${n===0?'feature-highlight':''}">${text(`catalog.${id}.title`,'h3')}${text(`catalog.${id}.desc`)}${link(language,`service-${id}`,'catalog.portal','catalogue-link')}</article>`).join('')}</div>${mock('reconciliation',true)}</div>`);}
