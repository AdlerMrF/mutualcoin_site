export function initTheme() {
  const root = document.documentElement;
  const copy = JSON.parse(document.getElementById('runtime-copy').textContent);
  const buttons = [...document.querySelectorAll('[data-theme-toggle]')];
  function update() {
    for (const button of buttons) {
      button.setAttribute('aria-pressed', String(root.dataset.theme === 'dark'));
      button.setAttribute('aria-label', copy['theme.dark']);
    }
  }
  for (const button of buttons) button.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('mutucoin-theme', root.dataset.theme); } catch { /* Preferência visual opcional. */ }
    update();
    document.dispatchEvent(new CustomEvent('themechange', { detail: root.dataset.theme }));
  });
  update();
  const columns = [...document.querySelectorAll('.footer-column')];
  const compact = matchMedia('(max-width: 767px)');
  const layout = () => columns.forEach(column => { column.open = !compact.matches; });
  compact.addEventListener('change', layout);
  layout();
}
