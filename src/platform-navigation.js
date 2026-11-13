export function initPlatformNavigation() {
  const menu = document.querySelector('.platform-navigation');
  if (!menu) return;
  const summary = menu.querySelector('summary');
  menu.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.open) {
      menu.open = false;
      summary.focus();
    }
  });
  document.addEventListener('click', event => {
    if (!menu.contains(event.target)) menu.open = false;
  });
  menu.addEventListener('focusout', event => {
    if (!menu.contains(event.relatedTarget)) menu.open = false;
  });
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { menu.open = false; }));
  window.addEventListener('resize', () => { menu.open = false; });
}
