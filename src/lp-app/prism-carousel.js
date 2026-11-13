// Casos de uso em carrossel coverflow 3D contínuo, sem bibliotecas e compatível com a CSP.
// Reaproveita os cartões existentes de #rooms (duplicados para fechar a volta): os do centro vêm à frente,
// os das pontas giram e desfocam. Desliza sozinho; aceita arrastar, setas, teclado, clique e trackpad.
(() => {
  const root = document.getElementById('rooms');
  if (!root || !document.documentElement.hasAttribute('data-lp-polish')) return;
  const stage = root.querySelector('.rooms__stage');
  const track = root.querySelector('.rooms__track');
  const originals = track ? [...track.querySelectorAll(':scope > .rooms__place')] : [];
  if (!stage || originals.length < 2) return;

  const DRIFT = 32;          // px/s do deslize automático
  const REACH = 2.08;        // em cartões: distância do centro em que o giro e o recuo chegam ao máximo
  const MAX_TILT = 28, DEPTH = 200, MIN_SCALE = .85, MAX_BLUR = 2;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const count = originals.length;
  const pad = value => String(value).padStart(2, '0');
  const items = originals.map(slide => ({
    title: slide.querySelector('.rooms__label')?.textContent.trim() ?? '',
    sub: [...slide.querySelectorAll('.rooms__talk .m-caption__text')].map(line => line.textContent.trim()).join(' ')
  }));

  // Título e descrição dentro de cada cartão, no canto inferior esquerdo.
  originals.forEach((slide, i) => {
    const text = document.createElement('div');
    text.className = 'prism__text';
    const heading = document.createElement('span');
    heading.className = 'prism__title';
    heading.textContent = items[i].title;
    const description = document.createElement('span');
    description.className = 'prism__sub';
    description.textContent = items[i].sub;
    text.append(heading, description);
    slide.append(text);
  });

  // Cópias decorativas para a faixa nunca mostrar um vazio em telas largas.
  const clones = originals.map(slide => {
    const clone = slide.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.append(clone);
    return clone;
  });
  const slides = [...originals, ...clones];
  const total = slides.length;

  // Legenda e controles abaixo da faixa.
  const foot = document.createElement('div');
  foot.className = 'prism__foot';
  const caption = document.createElement('div');
  caption.className = 'prism__caption';
  const title = document.createElement('span');
  title.className = 'prism__title';
  const sub = document.createElement('span');
  sub.className = 'prism__sub';
  caption.append(title, sub);
  const controls = document.createElement('div');
  controls.className = 'prism__controls';
  const button = (label, path) => {
    const element = document.createElement('button');
    element.type = 'button';
    element.className = 'prism__btn';
    element.setAttribute('aria-label', label);
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    line.setAttribute('d', path);
    svg.append(line);
    element.append(svg);
    return element;
  };
  const previous = button('Caso anterior', 'm15 18-6-6 6-6');
  const next = button('Próximo caso', 'm9 18 6-6-6-6');
  const counter = document.createElement('span');
  counter.className = 'prism__count';
  controls.append(previous, counter, next);
  foot.append(caption, controls);
  stage.append(foot);

  stage.setAttribute('role', 'region');
  stage.setAttribute('aria-roledescription', 'carrossel');
  stage.setAttribute('aria-label', 'Casos de uso. Arraste, use os botões ou as setas do teclado para alternar.');
  stage.tabIndex = 0;
  root.setAttribute('data-prism', '');

  let spacing = 1, loop = 1;
  let position = 0;            // deslocamento da faixa, em px
  let target = null;           // destino de um passo (setas, clique, teclado)
  let velocity = 0;            // inércia depois de arrastar, px/s
  let active = -1, drawn = NaN, frame = 0, last = 0;
  let hovered = false, focused = false, visible = false, dragging = false, swallowClick = false;
  const offsets = new Array(total).fill(0);

  const measure = () => {
    const width = originals[0].offsetWidth;
    spacing = width + Math.max(6, width * .02);
    loop = spacing * total;
    drawn = NaN;
  };
  const drifting = () => visible && !hovered && !focused && !dragging && target === null && !document.hidden && !reduced.matches;

  const draw = () => {
    if (position === drawn) return;
    drawn = position;
    const reach = spacing * REACH;
    let nearest = 0, nearestGap = Infinity;
    slides.forEach((slide, i) => {
      let x = (i * spacing - position) % loop;
      if (x < -loop / 2) x += loop; else if (x >= loop / 2) x -= loop;
      offsets[i] = x;
      const gap = Math.abs(x);
      if (gap < nearestGap) { nearestGap = gap; nearest = i; }
      const t = Math.min(1, gap / reach);
      const z = DEPTH * (1 - t);
      const tilt = Math.max(-MAX_TILT, Math.min(MAX_TILT, -x / reach * MAX_TILT));
      const blur = MAX_BLUR * Math.max(0, (t - .7) / .3);
      slide.style.transform = `translate3d(${x.toFixed(2)}px, 0, ${z.toFixed(2)}px) rotateY(${tilt.toFixed(2)}deg) scale(${(MIN_SCALE + z / 2000).toFixed(4)})`;
      slide.style.zIndex = String(Math.round(z));
      slide.style.filter = blur > .05 ? `blur(${blur.toFixed(2)}px)` : '';
    });
    if (nearest !== active) {
      slides[active]?.classList.remove('is-active');
      slides[nearest].classList.add('is-active');
      active = nearest;
      const item = items[nearest % count];
      title.textContent = item.title;
      sub.textContent = item.sub;
      counter.textContent = `${pad(nearest % count + 1)} / ${pad(count)}`;
    }
  };

  const tick = now => {
    const dt = Math.min(.25,(now - last) / 1000 || 0);
    last = now;
    if (!dragging) {
      if (target !== null) {
        position += (target - position) * (1 - Math.exp(-dt * 7));
        if (Math.abs(target - position) < .4) { position = target; target = null; announce(); }
      } else if (Math.abs(velocity) > 4) {
        position += velocity * dt;
        velocity *= Math.exp(-dt * 3);
      } else {
        velocity = 0;
        if (drifting()) position += DRIFT * dt;
      }
    }
    draw();
    frame = visible && !document.hidden ? requestAnimationFrame(tick) : 0;
  };
  const run = () => { if (!frame && visible && !document.hidden) { last = performance.now(); frame = requestAnimationFrame(tick); } };
  const announce = () => caption.setAttribute('aria-live', drifting() ? 'off' : 'polite');

  // Leva um cartão ao centro; em movimento reduzido, sem animação.
  const moveTo = destination => {
    velocity = 0;
    if (reduced.matches) { position = destination; target = null; draw(); } else target = destination;
    announce();
    run();
  };
  const step = direction => moveTo((Math.round((target ?? position) / spacing) + direction) * spacing);

  previous.addEventListener('click', () => step(-1));
  next.addEventListener('click', () => step(1));
  stage.addEventListener('keydown', event => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    step(event.key === 'ArrowRight' ? 1 : -1);
  });
  track.addEventListener('click', event => {
    if (swallowClick) { swallowClick = false; return; }
    const slide = event.target.closest('.rooms__place');
    const i = slides.indexOf(slide);
    if (i >= 0) moveTo(position + offsets[i]);
  });

  // Arrastar ou deslizar para os lados, com inércia ao soltar.
  let pointer = null, startX = 0, lastX = 0, lastTime = 0;
  const endDrag = () => {
    if (pointer === null) return;
    pointer = null;
    if (!dragging) return;
    dragging = false;
    track.classList.remove('is-dragging');
    if (reduced.matches) velocity = 0;
    announce();
  };
  track.addEventListener('pointerdown', event => {
    if (event.button !== 0 || !event.isPrimary) return;
    pointer = event.pointerId;
    startX = lastX = event.clientX;
    lastTime = performance.now();
    swallowClick = false;
  });
  track.addEventListener('pointermove', event => {
    if (event.pointerId !== pointer) return;
    if (!dragging && Math.abs(event.clientX - startX) > 6) {
      dragging = true;
      swallowClick = true;
      target = null;
      velocity = 0;
      track.classList.add('is-dragging');
      try { track.setPointerCapture(pointer); } catch { /* ponteiro já liberado */ }
      announce();
      run();
    }
    if (!dragging) return;
    const now = performance.now();
    const moved = event.clientX - lastX;
    position -= moved;
    velocity = .7 * velocity + .3 * (-moved / Math.max(1, now - lastTime) * 1000);
    lastX = event.clientX;
    lastTime = now;
  });
  track.addEventListener('pointerup', event => { if (event.pointerId === pointer) endDrag(); });
  track.addEventListener('pointercancel', event => { if (event.pointerId === pointer) { velocity = 0; endDrag(); } });
  track.addEventListener('dragstart', event => event.preventDefault());

  // Rolagem horizontal (trackpad) move a faixa; a rolagem vertical da página fica intacta.
  track.addEventListener('wheel', event => {
    if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
    event.preventDefault();
    target = null;
    velocity = 0;
    position += event.deltaX;
    run();
  }, { passive: false });

  stage.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') { hovered = true; announce(); } });
  stage.addEventListener('pointerleave', () => { hovered = false; announce(); });
  stage.addEventListener('focusin', () => { focused = true; announce(); });
  stage.addEventListener('focusout', () => { focused = stage.contains(document.activeElement); announce(); });
  document.addEventListener('visibilitychange', run);

  const show = state => {
    visible = state;
    root.classList.toggle('is-prism-visible', state);
    if (state) root.classList.add('is-prism-ready');
    announce();
    run();
  };
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => show(entries.some(entry => entry.isIntersecting)), { threshold: .2 }).observe(track);
  } else show(true);
  const resize = () => {
    const ratio = position / spacing;
    measure();
    position = ratio * spacing;
    if (target !== null) target = Math.round(target / spacing) * spacing;
    draw();
  };
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(track);
  else addEventListener('resize', resize);

  measure();
  draw();
  announce();
})();
