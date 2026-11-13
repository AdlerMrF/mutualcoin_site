import { lerMovimentoPublico, mostrarMovimentoPublico, passoContador, formatarNumeroPublico } from './home-dados.js';

function initMarketReveal({ gsap, reduceMotion }) {
  const cards = [...document.querySelectorAll('.market-card')];
  if (!cards.length || reduceMotion) return;
  let tween;
  const finish = () => {
    clearTimeout(fallback);
    tween?.scrollTrigger?.kill();
    tween?.kill();
    gsap.set(cards, { clearProps: 'opacity,visibility,transform' });
  };
  // A leitura nunca depende de um aviso de rolagem: após este prazo tudo fica visível.
  const fallback = setTimeout(finish, 2000);
  tween = gsap.fromTo(cards, {
    x: index => (index % 2 ? 24 : -24) * (document.documentElement.dir === 'rtl' ? -1 : 1),
    y: 18, opacity: 0,
  }, {
    x: 0, y: 0, opacity: 1, duration: .65, stagger: .09, ease: 'power2.out',
    scrollTrigger: { trigger: '.market-bento', start: 'top 88%', once: true },
    onComplete: finish,
  });
  cards.forEach(card => card.addEventListener('focus', finish, { once: true }));
}

export function initHomeMotion({ gsap, reduceMotion }) {
  initMarketReveal({ gsap, reduceMotion });
  const section = document.querySelector('[data-home-readings]');
  if (!section) return;
  const copy = JSON.parse(document.getElementById('runtime-copy').textContent);
  const animar = (tela, valor, idioma) => {
    if (reduceMotion) return;
    const progresso = { passo: 0 };
    tela.textContent = formatarNumeroPublico(passoContador(valor, 0), idioma);
    gsap.to(progresso, {
      passo: 1000, duration: 1.4, ease: 'power2.out',
      onUpdate: () => { tela.textContent = formatarNumeroPublico(passoContador(valor, progresso.passo), idioma); },
      onComplete: () => { tela.textContent = formatarNumeroPublico(valor, idioma); },
    });
  };
  const dadosObserver = new IntersectionObserver(async (entries, observer) => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    observer.disconnect();
    mostrarMovimentoPublico(document, await lerMovimentoPublico(), { animar });
    document.documentElement.dataset.homeReadingsReady = 'true';
  }, { rootMargin: '120px' });
  dadosObserver.observe(section);

  if (!reduceMotion) {
    document.querySelectorAll('main > section:not(#hero) h2').forEach(title => {
      gsap.fromTo(title, { y: 8 }, {
        y: 0, ease: 'none',
        scrollTrigger: { trigger: title, start: 'top 92%', end: 'top 55%', scrub: true },
      });
    });
    // O título principal e a mídia do hero já estão visíveis no primeiro quadro.
    // Só a decoração de fundo reage à rolagem, sem entrada que atrase a leitura.
    gsap.to('.site-hero .hero-squares', {
      y: 32, ease: 'none',
      scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true },
    });
    gsap.from('#manifesto-grid .content-card', {
      y: 16, opacity: .5, stagger: .08, duration: .65,
      scrollTrigger: { trigger: '#manifesto-grid', start: 'top 88%', once: true },
    });
  }

  const columns = document.querySelector('.asset-columns');
  const toggle = document.querySelector('.asset-motion-toggle');
  if (reduceMotion) return;
  let visible = false, paused = false;
  const update = () => columns.classList.toggle('is-running', visible && !paused && !document.hidden);
  toggle.hidden = false;
  toggle.addEventListener('click', () => {
    paused = !paused;
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.textContent = copy[paused ? 'motion.resume' : 'motion.pause'];
    update();
  });
  const columnObserver = new IntersectionObserver(entries => {
    visible = entries.some(entry => entry.isIntersecting);
    update();
  });
  columnObserver.observe(columns);
  document.addEventListener('visibilitychange', update);
}
