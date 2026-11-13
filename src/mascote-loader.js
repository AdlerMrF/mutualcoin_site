export function initMascoteLoader(translate) {
  for (const figure of document.querySelectorAll('[data-mascote]')) mountFigure(figure, translate);
}

function mountFigure(figure, translate) {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const button = figure.querySelector('button');
  let visible = false;
  let paused = preference.matches;
  let portrait;
  let loading;
  function sync() {
    const playing = visible && !paused && !preference.matches && !document.hidden;
    figure.dataset.playing = String(playing);
    button.hidden = preference.matches;
    button.setAttribute('aria-pressed', String(paused));
    const key = paused ? 'video.play' : 'video.pause';
    button.dataset.i18nAriaLabel = key;
    button.dataset.i18nTitle = key;
    button.setAttribute('aria-label', translate(key));
    button.title = translate(key);
    if (!portrait) return;
    if (playing) portrait.start();
    else portrait.stop();
    if (preference.matches) portrait.staticFrame();
  }
  const observer = new IntersectionObserver(async (entries) => {
    visible = entries[0].isIntersecting;
    if (visible && !loading) {
      loading = import('./mascote.js').then(({ mountMascote }) => {
        portrait = mountMascote(figure.querySelector('canvas'));
        portrait.staticFrame();
        figure.dataset.loaded = 'true';
      });
    }
    if (loading) await loading;
    sync();
  });
  observer.observe(figure);
  button.addEventListener('click', () => { paused = !paused; sync(); });
  figure.addEventListener('pointerenter', () => {
    if (!preference.matches) portrait?.setThinking(true);
  });
  figure.addEventListener('pointerleave', () => portrait?.setThinking(false));
  document.addEventListener('visibilitychange', sync);
  preference.addEventListener('change', () => { paused = preference.matches; sync(); });
  sync();
}
