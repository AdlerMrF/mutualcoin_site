// Entrada exclusiva da apresentação pública: sem API, widgets, carteira ou autenticação.
import './assets/css/styles.css';
import './assets/css/mutucoin.css';
import './assets/css/blindagem.css';
import './assets/css/catalogue.css';
import './assets/css/enterprise-impact.css';
import './assets/css/mutual-design-system.css';
import './assets/css/public-preview.css';
import './assets/css/liquid-glass.css';
import { initTheme } from './theme.js';
import { initShield } from './blindagem.js';
import { initNeedsChecklist } from './needs-checklist.js';
import { initAudienceNavigation, initCircuitMotion } from './audience-navigation.js';
import { initVideos } from './videos.js';

initTheme();
initShield();
initNeedsChecklist();
initAudienceNavigation();
initCircuitMotion();
initVideos();
if (document.querySelector('[data-enterprise-scene]')) import('./enterprise-motion.js');
requestAnimationFrame(() => { import('./liquid-glass.js').then(({ initLiquidGlass }) => initLiquidGlass()); });

for (const selector of document.querySelectorAll('#language-select, [data-language-select]')) {
  selector.value = document.documentElement.lang;
  selector.addEventListener('change', () => {
    // As alternativas são os endereços locais já gerados para a mesma página.
    const alternate = document.querySelector(`link[rel="alternate"][hreflang="${selector.value}"]`);
    if (!alternate) return;
    const url = new URL(alternate.href);
    location.assign(url.pathname + location.search + location.hash);
  });
}

const button = document.getElementById('mobile-menu-button');
const menu = document.getElementById('mobile-menu');
const focusable = () => [...menu.querySelectorAll('a[href],button,select')].filter(el => el.getClientRects().length);
function toggle(open, restore = false) {
  menu.classList.toggle('hidden', !open);
  button.setAttribute('aria-expanded', String(open));
  document.getElementById('icon-menu').classList.toggle('hidden', open);
  document.getElementById('icon-close').classList.toggle('hidden', !open);
  if (open) focusable()[0]?.focus();
  else if (restore) button.focus();
}
button.addEventListener('click', () => toggle(button.getAttribute('aria-expanded') !== 'true'));
document.addEventListener('keydown', event => {
  if (button.getAttribute('aria-expanded') !== 'true') return;
  if (event.key === 'Escape') { event.preventDefault(); toggle(false, true); }
  if (event.key === 'Tab') {
    const items = [button, ...focusable()];
    const index = items.indexOf(document.activeElement);
    if (event.shiftKey && index <= 0) { event.preventDefault(); items.at(-1)?.focus(); }
    else if (!event.shiftKey && index === items.length - 1) { event.preventDefault(); button.focus(); }
  }
});
document.addEventListener('click', event => {
  if (!menu.contains(event.target) && !button.contains(event.target)) toggle(false);
});
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => toggle(false)));
window.addEventListener('resize', () => toggle(false));
document.getElementById('splash-screen')?.remove();
document.documentElement.dataset.previewReady = 'true';
