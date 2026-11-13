const preference = matchMedia('(prefers-reduced-motion: reduce)');

document.querySelectorAll('[data-enterprise-scene]').forEach((scene) => {
  const stage = scene.querySelector('.vault-stage');
  if (!stage) return;

  let visible = false;
  const update = () => {
    scene.dataset.active = String(visible && !document.hidden && !preference.matches);
  };

  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    update();
  }, { rootMargin: '10% 0px' });
  observer.observe(scene);

  scene.addEventListener('pointermove', (event) => {
    if (preference.matches || event.pointerType === 'touch') return;
    const bounds = scene.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    stage.style.setProperty('--scene-ry', `${x * 9}deg`);
    stage.style.setProperty('--scene-rx', `${y * -7}deg`);
  });

  scene.addEventListener('pointerleave', () => {
    stage.style.setProperty('--scene-ry', '0deg');
    stage.style.setProperty('--scene-rx', '0deg');
  });
  document.addEventListener('visibilitychange', update);
  preference.addEventListener('change', update);
  update();
});

const localDemoHost = ['127.0.0.1', 'localhost'].includes(window.location.hostname);
document.querySelectorAll('[data-terminal-frame]').forEach((frame) => {
  if (!localDemoHost) frame.src = frame.dataset.publicSrc;
});
document.querySelectorAll('[data-terminal-link]').forEach((link) => {
  if (!localDemoHost) link.href = link.dataset.publicHref;
});
