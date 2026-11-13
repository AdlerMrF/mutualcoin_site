export function initShield() {
  const header = document.getElementById('navbar-header');
  const inner = document.getElementById('navbar-inner');
  // Mantém a linha única; o mesmo menu completo atende traduções mais longas.
  const fit = () => {
    header.dataset.compact = 'false';
    const navigation=inner.querySelector('.desktop-navigation');
    const navigationOverflows=navigation?.getClientRects().length && navigation.scrollWidth>navigation.clientWidth+1;
    header.dataset.compact = String(inner.scrollWidth > inner.clientWidth + 1 || Boolean(navigationOverflows));
  };
  new ResizeObserver(fit).observe(inner);
  document.fonts.ready.then(fit);
  fit();

  document.querySelectorAll('.market-tabs[role="tablist"]').forEach(tablist => {
    const tabs = [...tablist.querySelectorAll('[role="tab"]')];
    function select(tab, focus = false) {
      for (const item of tabs) {
        const selected = item === tab;
        item.setAttribute('aria-selected', String(selected));
        item.tabIndex = selected ? 0 : -1;
        const panel = document.getElementById(item.getAttribute('aria-controls'));
        if (panel) panel.hidden = !selected;
      }
      if (focus) tab.focus();
    }
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => select(tab));
      tab.addEventListener('keydown', event => {
        const rtl = document.documentElement.dir === 'rtl';
        const step = event.key === 'ArrowRight' ? (rtl ? -1 : 1) : event.key === 'ArrowLeft' ? (rtl ? 1 : -1) : 0;
        const target = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : step ? (index + step + tabs.length) % tabs.length : null;
        if (target !== null) { event.preventDefault(); select(tabs[target], true); }
      });
    });
    if (tabs.length) select(tabs.find(tab => tab.getAttribute('aria-selected') === 'true') || tabs[0]);
  });
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const observer = new IntersectionObserver(entries => entries.forEach(({target,isIntersecting}) => {
    target.classList.toggle('shield-visible', isIntersecting && !document.hidden && !preference.matches);
  }));
  document.querySelectorAll('.shield-section,.network-movement,.markets-section').forEach(section => observer.observe(section));
  // O controle existente das ilustrações também pausa arco, globo e token.
  document.querySelector('.asset-motion-toggle')?.addEventListener('click', event => {
    document.body.classList.toggle('shield-paused', event.currentTarget.getAttribute('aria-pressed') === 'true');
  });
  document.addEventListener('visibilitychange', () => {
    document.querySelectorAll('.shield-section,.network-movement,.markets-section').forEach(section => {
      if (document.hidden) section.classList.remove('shield-visible');
      else { observer.unobserve(section); observer.observe(section); }
    });
  });
}
