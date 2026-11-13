// A reprodução acompanha a visibilidade; a pausa escolhida pelo visitante é preservada.
export function initVideos() {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const copy = JSON.parse(document.getElementById('runtime-copy').textContent);
  const media = [...document.querySelectorAll('.story-frame')].flatMap(frame => {
    const video = frame.querySelector('video');
    const button = frame.querySelector('.story-toggle');
    // Algumas molduras são apenas ilustrações. Só inicializa as que têm vídeo e controle.
    if (!video || !button) return [];
    // Impede qualquer início antes da verificação de movimento e visibilidade.
    video.autoplay = false;
    video.muted = true;
    return [{ frame, video, button, paused: preference.matches, visible: false, ratio: 0 }];
  });
  let active = null;
  function control(item) {
    const playing = !item.video.paused;
    item.frame.dataset.playing = String(playing);
    item.button.setAttribute('aria-pressed', String(!playing));
    item.button.setAttribute('aria-label', copy[playing ? 'video.pause' : 'video.play']);
    item.button.title = copy[playing ? 'video.pause' : 'video.play'];
  }
  function sync(preferred) {
    const available = media.filter(item => !item.paused && item.visible);
    // Só um vídeo se move por vez; uma escolha manual tem prioridade.
    active = document.hidden ? null : available.includes(preferred) ? preferred
      : available.sort((a, b) => b.ratio - a.ratio || (a === active ? -1 : b === active ? 1 : 0))[0] || null;
    for (const item of media) {
      if (item !== active) { item.video.pause(); control(item); }
    }
    if (active) {
      const item = active;
      item.video.play().catch(() => control(item));
    }
  }
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      const item = media.find(item => item.video === entry.target);
      item.visible = entry.isIntersecting && entry.intersectionRatio > 0;
      if (item.visible && !item.loaded) {
        const source = item.video.querySelector('source');
        source.src = source.dataset.src;
        item.video.load();
        item.loaded = true;
      }
      item.ratio = entry.intersectionRatio;
    }
    sync();
  }, { threshold: [0, 0.01, 0.25, 0.5, 0.75, 1] });
  for (const item of media) {
    item.video.addEventListener('play', () => {
      if (item !== active || item.paused || !item.visible || document.hidden) item.video.pause();
      control(item);
    });
    item.video.addEventListener('pause', () => control(item));
    item.button.addEventListener('click', () => {
      item.paused = !item.video.paused;
      sync(item.paused ? null : item);
    });
    control(item);
    observer.observe(item.video);
  }
  document.addEventListener('visibilitychange', () => sync());
  preference.addEventListener('change', () => {
    for (const item of media) item.paused = preference.matches;
    sync();
  });
  document.documentElement.dataset.videosReady = 'true';
}
