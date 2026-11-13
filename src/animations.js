import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initHomeMotion } from './home-motion.js';

gsap.registerPlugin(ScrollTrigger);
const copy = JSON.parse(document.getElementById('runtime-copy').textContent);
const translate = (key) => copy[key];
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const reduceMotion = motionPreference.matches;
const cleanLayout = document.body.classList.contains('mutucoin-site');
// Rebuild once if the system motion preference changes.
motionPreference.addEventListener('change', () => window.location.reload());
const splash = document.getElementById('splash-screen');
gsap.to(splash, { autoAlpha: 0, duration: reduceMotion ? 0 : 0.45, delay: reduceMotion ? 0 : 0.35, onComplete: () => splash.remove() });

// Deixar o browser restaurar a posição de scroll no reload (F5)
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'auto';
}

// Criar Lenis já PARADO — só vai rodar depois do layout estabilizar
const lenis = new Lenis({
  lerp: 0.1,
  smoothWheel: !reduceMotion,
  duration: 1.2,
  autoStart: false,       // ← NÃO inicia o RAF automaticamente
});

// Co-op GSAP/Lenis: o ticker do GSAP drive o Lenis (sem RAF separado)
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// Proxy para o ScrollTrigger usar o scroll suave do Lenis
ScrollTrigger.scrollerProxy(document.body, {
  scrollTop(value) {
    if (arguments.length) {
      lenis.scrollTo(value, { immediate: true });
    }
    return lenis.scroll;
  },
  getBoundingClientRect() {
    return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
  },
});

lenis.on('scroll', ScrollTrigger.update);

// ── Navbar pill (SHL-02) ────────────────────────────────────────────────
const navHeader = document.getElementById('navbar-header');
const navWrapper = document.getElementById('navbar-wrapper');
const navLeft = document.getElementById('navbar-left');
const navCenter = document.getElementById('navbar-center');
const navRight = document.getElementById('navbar-right');
const navInner = document.getElementById('navbar-inner');

let prevScrolled = null;

function applyNavState(scrolled, force = false) {
  if (!force && scrolled === prevScrolled) return;
  prevScrolled = scrolled;

  if (navHeader) navHeader.dataset.scrolled = String(scrolled);
  if (navHeader) navHeader.style.top = scrolled ? '0px' : '12px';
  if (navWrapper) navWrapper.style.padding = scrolled ? '12px 16px 0' : '0';
  if (navLeft) navLeft.style.opacity = scrolled ? '0' : '1';
  if (navRight) navRight.style.opacity = scrolled ? '0' : '1';
  if (navCenter) {
    navCenter.style.maxWidth = scrolled ? '1150px' : '1280px';
    navCenter.style.borderRadius = scrolled ? '1rem' : '0';
    navCenter.style.background = scrolled ? 'rgba(11,16,32,0.82)' : 'transparent';
    navCenter.style.backdropFilter = scrolled ? 'blur(20px) saturate(1.4)' : 'none';
    navCenter.style.boxShadow = scrolled ? '0 4px 30px rgba(0,0,0,0.35)' : 'none';
    navCenter.style.borderColor = scrolled ? 'rgba(27,42,70,0.7)' : 'transparent';
  }
  if (navInner) {
    navInner.style.height = scrolled
      ? (window.innerWidth < 1280 ? '58px' : '64px')
      : (window.innerWidth < 1280 ? '68px' : '88px');
    const sidePad = window.innerWidth < 1280 ? '16px' : (scrolled ? '16px' : '40px');
    navInner.style.paddingLeft = sidePad;
    navInner.style.paddingRight = sidePad;
  }
}

applyNavState(false);
window.addEventListener('resize', () => applyNavState(prevScrolled === true, true), { passive: true });

ScrollTrigger.create({
  trigger: 'body',
  start: 'top -80px',
  onEnter: () => applyNavState(true),
  onLeaveBack: () => applyNavState(false),
});

// ── Authority bar hide (SHL-01) ─────────────────────────────────────────
ScrollTrigger.create({
  trigger: 'body',
  start: 'top -60px',
  onEnter: () => gsap.to('#authority-bar', { opacity: 0, y: -36, duration: reduceMotion ? 0 : 0.38, ease: 'power2.inOut', pointerEvents: 'none' }),
  onLeaveBack: () => gsap.to('#authority-bar', { opacity: 1, y: 0, duration: reduceMotion ? 0 : 0.38, ease: 'power2.inOut', pointerEvents: 'auto' }),
});

// ── Mobile menu (D-02) ──────────────────────────────────────────────────
const mobileMenuBtn = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const iconMenu = document.getElementById('icon-menu');
const iconClose = document.getElementById('icon-close');
const mobileLinks = document.querySelectorAll('.mobile-menu-link, #mobile-menu .mega-panel a');
let menuOpen = false;

function openMobileMenu() {
  if (!mobileMenu) return;
  menuOpen = true;
  mobileMenu.classList.remove('hidden');
  if (iconMenu) iconMenu.classList.add('hidden');
  if (iconClose) iconClose.classList.remove('hidden');
  if (mobileMenuBtn) { mobileMenuBtn.setAttribute('aria-expanded', 'true'); mobileMenuBtn.setAttribute('aria-label', translate('menu.close')); }
}

function closeMobileMenu() {
  if (!mobileMenu) return;
  menuOpen = false;
  mobileMenu.classList.add('hidden');
  if (iconMenu) iconMenu.classList.remove('hidden');
  if (iconClose) iconClose.classList.add('hidden');
  if (mobileMenuBtn) { mobileMenuBtn.setAttribute('aria-expanded', 'false'); mobileMenuBtn.setAttribute('aria-label', translate('menu.open')); }
}

if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener('click', () => (menuOpen ? closeMobileMenu() : openMobileMenu()));
}
window.addEventListener('resize', () => { if (window.innerWidth >= 1024) closeMobileMenu(); });
document.addEventListener('click', (event) => { if (menuOpen && !event.target.closest('#navbar-header')) closeMobileMenu(); });
mobileLinks.forEach((link) => link.addEventListener('click', closeMobileMenu));
lenis.on('scroll', ({ scroll }) => { if (menuOpen && scroll > 200) closeMobileMenu(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menuOpen) { closeMobileMenu(); mobileMenuBtn?.focus(); } });

// ── Anchor smooth-scroll via Lenis ──────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    if (this.classList.contains('icp-tab-btn') || this.classList.contains('tech-mod-btn')) return;
    const id = this.getAttribute('href');
    if (!id || id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    closeMobileMenu();
    const navHeight = document.getElementById('navbar-inner')?.offsetHeight ?? 64;
    const authorityH = prevScrolled ? 0 : (document.getElementById('authority-bar')?.offsetHeight ?? 36);
    lenis.scrollTo(target, { offset: -(navHeight + authorityH + 8), duration: reduceMotion ? 0 : 0.9, immediate: reduceMotion });
  });
});

// ── Scroll-spy de nav links (SHL-03) ────────────────────────────────────
const navLinks = document.querySelectorAll('nav a[href^="#"]');

function setActiveLink(href) {
  navLinks.forEach((link) => {
    link.classList.toggle('nav-link-active', link.getAttribute('href') === href);
  });
}

document.querySelectorAll('section[id]').forEach((section) => {
  ScrollTrigger.create({
    trigger: section,
    start: 'top 40%',
    end: 'bottom 40%',
    onEnter: () => setActiveLink(`#${section.id}`),
    onEnterBack: () => setActiveLink(`#${section.id}`),
  });
});

// ── Hero entrada + parallax (MOT-03) ─────────────────────────────────────
if (!cleanLayout && document.querySelector('.hero-layout')) {
gsap.set('.hero-earth-wrap', { yPercent: reduceMotion ? 0 : 42 });

const heroTl = gsap.timeline({ delay: 0 });
heroTl
  .fromTo('.hero-badge',    { autoAlpha: 0, y: 28, filter: 'blur(8px)' }, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.6, ease: 'circ.out' })
  .add('text-enter', '-=0.5')
  .fromTo('.hero-line',     { autoAlpha: 0, y: 28, filter: 'blur(8px)' }, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.7, stagger: 0.12, ease: 'circ.out' }, 'text-enter')
  .add('earth-enter', 'text-enter+=0.05')
  .fromTo('.hero-earth',    { yPercent: 14, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 0.9, duration: 1.35, ease: 'power3.out' }, 'earth-enter')
  .fromTo('.hero-sub',      { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 'text-enter+=0.4')
  .fromTo('.hero-ctas',     { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 'earth-enter+=0.58')
  .fromTo('.hero-auth',     { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 'earth-enter+=0.72');

if (reduceMotion) heroTl.progress(1).kill();

if (!reduceMotion) gsap.to('.hero-earth-wrap', {
  yPercent: 26,
  ease: 'none',
  scrollTrigger: {
    trigger: '#hero',
    start: 'top top',
    end: 'bottom top',
    scrub: 1.2,
    immediateRender: false,
    invalidateOnRefresh: true,
  },
});


}

// ── Scroll progress indicator ─────────────────────────────────────────────
const progressBar = document.getElementById('scroll-progress');
if (progressBar) {
  lenis.on('scroll', ({ scroll, limit }) => {
    const pct = limit > 0 ? Math.min((scroll / limit) * 100, 100) : 0;
    progressBar.style.width = `${pct}%`;
  });
}

// ── Reveal on scroll (MOT-01) — stagger direcional ────────────────────────


if (reduceMotion || cleanLayout) {
  gsap.set('.reveal', { opacity: 1, y: 0, x: 0, scale: 1 });
} else {
  gsap.set('.reveal', { opacity: 0, y: 24, scale: 0.96 });
  ScrollTrigger.batch('.reveal', {
    start: 'top 84%',
    onEnter: (batch) => {
      // Direção alternada: elementos pares vêm da direita, ímpares da esquerda
      batch.forEach((el, i) => {
        const fromX = i % 3 === 0 ? -16 : i % 3 === 2 ? 16 : 0;
        gsap.fromTo(el,
          { opacity: 0, y: 24, x: fromX, scale: 0.96 },
          { opacity: 1, y: 0, x: 0, scale: 1, duration: 0.75, ease: 'power3.out', delay: i * 0.05, overwrite: true }
        );
      });
    },
  });
}

// Counter countup (MOT-02)
  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const raw = el.getAttribute('data-count');
        const target = parseFloat(raw);
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';

        if (Number.isNaN(target)) return;

        if (reduceMotion) {
          el.textContent = prefix + raw + suffix;
        } else {
          const obj = { v: 0 };
          gsap.to(obj, {
            v: target,
            duration: 2,
            ease: 'power2.out',
            onUpdate: () => {
              el.textContent = prefix + Math.round(obj.v) + suffix;
            },
          });
        }
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('[data-count]').forEach((el) => {
    const raw = el.getAttribute('data-count');
    const target = parseFloat(raw);
    const prefix = el.getAttribute('data-prefix') || '';
    const suffix = el.getAttribute('data-suffix') || '';

    if (!Number.isNaN(target) && !reduceMotion) {
      el.textContent = prefix + '0' + suffix;
    }
    counterObserver.observe(el);
  });

// ── Magic card glow — tracking dinâmico só nos cards próximos ao cursor
const magicCards = Array.from(document.querySelectorAll('.magic-card'));
const MAGIC_PROXIMITY = 1000; // px — cards até 1000px do cursor recebem tracking
let magicPointer = null;
let magicFrame = null;

function initMagicCards() {
  magicCards.forEach((card) => {
    card.classList.add('magic-card-active');
    card.style.setProperty('--mouse-x', '-9999px');
    card.style.setProperty('--mouse-y', '-9999px');
    // Adiciona accent line sutil no topo (border reveal)
    if (!card.querySelector('.card-top-accent')) {
      const accent = document.createElement('div');
      accent.className = 'card-top-accent';
      card.appendChild(accent);
    }
  });
}

function updateMagicCards(clientX, clientY) {
  // Fase 1: lê todos os rects (evita layout thrashing)
  const states = magicCards.map((card) => {
    const rect = card.getBoundingClientRect();
    const inViewport = rect.bottom > 0 && rect.top < window.innerHeight;
    const near =
      inViewport &&
      clientX >= rect.left - MAGIC_PROXIMITY &&
      clientX <= rect.right + MAGIC_PROXIMITY &&
      clientY >= rect.top - MAGIC_PROXIMITY &&
      clientY <= rect.bottom + MAGIC_PROXIMITY;
    return { card, rect, near };
  });

  // Fase 2: escreve (sem intercalar leituras)
  states.forEach(({ card, rect, near }) => {
    if (near) {
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    } else {
      card.style.setProperty('--mouse-x', '-9999px');
      card.style.setProperty('--mouse-y', '-9999px');
    }
  });
}

initMagicCards();

document.addEventListener('pointermove', (e) => {
  if (reduceMotion || (e.pointerType && e.pointerType !== 'mouse')) return;
  magicPointer = { x: e.clientX, y: e.clientY };

  if (magicFrame) return;
  magicFrame = requestAnimationFrame(() => {
    magicFrame = null;
    if (!magicPointer) return;
    updateMagicCards(magicPointer.x, magicPointer.y);
  });
});

function resetMagicCards() {
  magicCards.forEach((card) => {
    card.style.setProperty('--mouse-x', '-9999px');
    card.style.setProperty('--mouse-y', '-9999px');
  });
  magicPointer = null;
}

document.addEventListener('mouseleave', resetMagicCards);
window.addEventListener('scroll', () => {
  if (!magicPointer) return;
  if (magicFrame) return;
  magicFrame = requestAnimationFrame(() => {
    magicFrame = null;
    if (!magicPointer) return;
    updateMagicCards(magicPointer.x, magicPointer.y);
  });
}, { passive: true });
window.addEventListener('blur', resetMagicCards);

// ── Seção de Tecnologia (SEC-09) - Abas Interativas ─────────────────────
const techButtons = document.querySelectorAll('.tech-mod-btn');
const techPanels = document.querySelectorAll('.tech-mockup-panel');

if (techButtons.length && techPanels.length) {
  const activateModule = (moduleName) => {
    techButtons.forEach((btn) => {
      const isActive = btn.getAttribute('data-module') === moduleName;
      btn.classList.toggle('tech-mod-btn-active', isActive);
      btn.setAttribute('aria-selected', String(isActive));
      btn.tabIndex = isActive ? 0 : -1;
    });

    techPanels.forEach((panel) => {
      const isTarget = panel.getAttribute('data-module') === moduleName;
      if (isTarget) {
        panel.classList.remove('hidden');
        panel.classList.add('flex');

        // GSAP transition
        gsap.fromTo(panel,
          { opacity: 0, scale: 0.98, y: 5 },
          { opacity: 1, scale: 1, y: 0, duration: reduceMotion ? 0 : 0.35, ease: 'power2.out', overwrite: 'auto' }
        );
      } else {
        panel.classList.remove('flex');
        panel.classList.add('hidden');
      }
    });
  };

  // Add click handlers
  techButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const mod = btn.getAttribute('data-module');
      if (mod) activateModule(mod);
    });
  });

  // Activate first module (M16) initially
  activateModule('M16');
}

// Contato institucional: canal comercial aguarda definição do dono.

// ── Quote Text Reveal ─────────────────────────────────────────────────────
const quotePinContainer = document.getElementById('quote-pin-container');
const quoteHeading = quotePinContainer?.querySelector('.quote-reveal-heading');

if (!reduceMotion && quotePinContainer && quoteHeading) {
  const text = quoteHeading.textContent.trim();
  const words = text.split(/\s+/);
  quoteHeading.innerHTML = '';

  const spans = [];
  words.forEach(word => {
    const span = document.createElement('span');
    span.textContent = word + ' ';
    span.style.opacity = '0.1';
    quoteHeading.appendChild(span);
    spans.push(span);
  });

  const tlQuote = gsap.timeline({
    scrollTrigger: {
      trigger: quotePinContainer,
      start: 'top 90%',
      end: 'top 30%',
      scrub: 1,
    }
  });

  tlQuote.fromTo(spans, {
    opacity: 0.1
  }, {
    opacity: 1,
    stagger: 0.1,
    ease: 'none',
    duration: 1
  });
}

// ── ICP Section ScrollSpy & Animations ──────────────────────────────────
const icpTabs = Array.from(document.querySelectorAll('.icp-tab-btn'));
const icpPanes = Array.from(document.querySelectorAll('.icp-tab-pane'));
let isAnimatingIcp = false;
let currentIcpTab = null;

function activateIcpTab(targetId) {
  if (isAnimatingIcp && currentIcpTab !== targetId) return;
  if (currentIcpTab === targetId) return;

  currentIcpTab = targetId;
  icpTabs.forEach((tab) => {
    const selected = tab.getAttribute('href') === targetId;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });

  // Update Buttons
  icpTabs.forEach(tab => {
    const isTarget = tab.getAttribute('href') === targetId;
    const textEl = tab.querySelector('.icp-tab-text');
    if (isTarget) {
      tab.classList.add('icp-tab-active');
      tab.classList.remove('hover:bg-[#1B2A46]/40');
      if(textEl) {
        textEl.classList.remove('text-[#8898C0]');
        textEl.classList.remove('group-hover:text-[#EEF1F9]');
        textEl.classList.add('text-[#030B1E]');
      }

      const indicator = document.getElementById('icp-tab-indicator');
      if (indicator) {
        indicator.style.width = `${tab.offsetWidth}px`;
        indicator.style.left = `${tab.offsetLeft}px`;
      }

      // Scroll the container to keep active tab visible
      const container = document.getElementById('icp-tabs-container');
      if (container) {
        const tabRect = tab.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        if (tabRect.left < containerRect.left || tabRect.right > containerRect.right) {
           container.scrollTo({
             left: tab.offsetLeft - container.clientWidth / 2 + tab.clientWidth / 2,
             behavior: 'smooth'
           });
        }
      }
    } else {
      tab.classList.remove('icp-tab-active');
      tab.classList.add('hover:bg-[#1B2A46]/40');
      if(textEl) {
        textEl.classList.remove('text-[#030B1E]');
        textEl.classList.add('text-[#8898C0]');
        textEl.classList.add('group-hover:text-[#EEF1F9]');
      }
    }
  });

  // Update Panes with fade transition
  const newTargetPane = icpPanes.find(pane => `#${pane.id}` === targetId);
  const activePanes = icpPanes.filter(pane => !pane.classList.contains('hidden') && pane !== newTargetPane);

  const contentContainer = document.getElementById('icp-content-container');

  const targetIndex = icpPanes.indexOf(newTargetPane);
  const currentIndex = activePanes.length ? icpPanes.indexOf(activePanes[0]) : 0;
  const direction = targetIndex > currentIndex ? 1 : -1;

  if (activePanes.length === 0 || reduceMotion) {
    activePanes.forEach(pane => { pane.classList.remove('block'); pane.classList.add('hidden'); });
    // Initial Setup
    if (newTargetPane) {
      newTargetPane.classList.remove('hidden');
      newTargetPane.classList.add('block');
      gsap.set(newTargetPane, { opacity: 1, y: 0 });
    }
    return;
  }

  isAnimatingIcp = true;

  if (contentContainer) {
    // Lock the height temporarily to prevent layout jumping and scrolling up
    contentContainer.style.minHeight = `${contentContainer.offsetHeight}px`;
  }

  gsap.to(activePanes, {
    opacity: 0,
    x: -30 * direction,
    duration: 0.25,
    ease: 'power2.in',
    onComplete: () => {
      activePanes.forEach(pane => {
        pane.classList.remove('block');
        pane.classList.add('hidden');
        gsap.set(pane, { clearProps: "all" });
      });

      if (newTargetPane) {
        newTargetPane.classList.remove('hidden');
        newTargetPane.classList.add('block');

        gsap.fromTo(newTargetPane,
          { opacity: 0, x: 30 * direction },
          { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out', onComplete: () => {
             // Reset min-height after transition
             if (contentContainer) {
               contentContainer.style.minHeight = '';
             }
             ScrollTrigger.refresh();
          }}
        );

        const cards = newTargetPane.querySelectorAll('.grid > div');
        if (cards.length && typeof reduceMotion !== 'undefined' && !reduceMotion) {
          gsap.fromTo(cards,
            { opacity: 0, x: 20 * direction },
            { opacity: 1, x: 0, duration: 0.4, stagger: 0.08, ease: 'power3.out', delay: 0.1 }
          );
        }
      } else {
        if (contentContainer) {
          contentContainer.style.minHeight = '';
        }
        ScrollTrigger.refresh();
      }
      isAnimatingIcp = false;
    }
  });
}

// Add click listeners
icpTabs.forEach(tab => {
  tab.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = tab.getAttribute('href');
    if (targetId) activateIcpTab(targetId);
  });
});

// Set initial position
window.addEventListener('load', () => {
  if (icpTabs.length > 0) {
    const active = document.querySelector('.icp-tab-active') || icpTabs[0];
    if (active) activateIcpTab(active.getAttribute('href'));
  }
});

// ── Pinned Text Reveal & Button Expansion ──────────────────────────────────
const pinContainer = document.getElementById('icp-cta-pin-container');
const heading = pinContainer?.querySelector('.text-reveal-heading');
const ctaBtn = document.getElementById('icp-cta-btn');
const ctaText = document.getElementById('icp-cta-text');
const ctaSvg = document.getElementById('icp-cta-svg');

gsap.matchMedia().add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
if (pinContainer && heading && ctaBtn && ctaText) {
  // Split heading text
  const text = heading.textContent.trim();
  const words = text.split(/\s+/);
  heading.innerHTML = '';

  words.forEach(word => {
    const span = document.createElement('span');
    span.textContent = word + ' ';
    span.style.opacity = '0.15';
    heading.appendChild(span);
  });

  // Split button text for Apple-like fadeout
  const btnChars = ctaText.textContent.trim().replace(/\s+/g, ' ').split('');
  ctaText.innerHTML = '';
  btnChars.forEach(char => {
    const span = document.createElement('span');
    span.textContent = char === ' ' ? '\u00A0' : char;
    span.style.display = 'inline-block';
    ctaText.appendChild(span);
  });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: pinContainer,
      start: 'top top',
      end: '+=160%', // 3.5x screen height for long smooth transition
      pin: true,
      scrub: 1.5, // buttery smooth
    }
  });

  // 1. Reveal H2 text
  tl.to(heading.querySelectorAll('span'), {
    opacity: 1,
    stagger: 0.1,
    ease: 'none',
    duration: 0.4
  });

  // Pequena pausa para leitura
  tl.to({}, { duration: 0.5 });

  // 2. Centralizar o botão e sumir com os textos
  tl.to(ctaText.querySelectorAll('span'), {
    y: -15,
    opacity: 0,
    stagger: 0.02,
    ease: 'power2.inOut',
    duration: 0.8
  });

  if (ctaSvg) {
    tl.to(ctaSvg, {
      x: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.inOut'
    }, '<');
  }

  // O H2 sobe e desaparece
  tl.to(heading, {
    opacity: 0,
    y: -40,
    duration: 1,
    ease: 'power2.inOut'
  }, '<');

  // O botão move para o centro exato da tela (considerando que o container estará no topo = 0)
  tl.to(ctaBtn, {
    y: () => (window.innerHeight / 2) - (ctaBtn.offsetTop + ctaBtn.offsetHeight / 2),
    duration: 1,
    ease: 'power2.inOut'
  }, '<');

  // 3. Remover brilhos, desativar clique e expandir o botão (Mais rápido que o texto)
  tl.to(ctaBtn, {
    pointerEvents: 'none',
    boxShadow: '0 0px 0px rgba(252,183,27,0)',
    width: '300vw',
    height: '300vh',
    borderRadius: '0px',
    duration: 3,
    ease: 'none'
  });

  // 4. Transição para branco começa LOGO no início da expansão
  tl.to('#icp-cta-btn-white', {
    opacity: 1,
    duration: 3,
    ease: 'none'
  }, '<'); // Começa junto com a expansão

  // 5. O título dos corredores acompanha a expansão do botão.
  tl.to('#fake-juris-header', {
    opacity: 1,
    scale: 1,
    duration: 3,
    ease: 'power2.out'
  }, '<0.1'); // Inicia quase junto, mas dura o dobro do tempo

  // 6. Esconde a seção de cartões e revela apenas no final, para não mostrar o corte seco por cima do fundo escuro
  tl.fromTo('#jurisdictions',
    { opacity: 0 },
    { opacity: 1, duration: 0.5, ease: 'power2.inOut' },
    '-=0.5'
  ).to(ctaBtn, { autoAlpha: 0, duration: 0.25 }, '-=0.25');

  const icpSection = document.getElementById('icp');
  if (icpSection) {
    document.body.style.overflowX = 'hidden'; // Mantém o recorte durante a expansão.
  }
  return () => {
    heading.textContent = text;
    ctaText.textContent = btnChars.join('');
    document.body.style.overflowX = '';
  };
}
});

// ── Timeline Scroll (Como Funciona) ─────────────────────────────────────────
const timelineWrapper = document.getElementById('how-scroll-wrapper');
const timelineTrack = document.getElementById('how-track');

if (timelineWrapper && timelineTrack && document.documentElement.dir !== 'rtl') {
  let mmTimeline = gsap.matchMedia();

  mmTimeline.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
    // We animate the track to shift left by the overflow amount.
    // We'll use the inner container's width (1600px) minus viewport.
    gsap.to(timelineTrack, {
      x: () => {
        const innerChild = timelineTrack.children[0];
        const scrollW = innerChild ? innerChild.offsetWidth : 1600;
        return (document.documentElement.dir === 'rtl' ? 1 : -1) * Math.max(0, scrollW - window.innerWidth + 100); // 100px extra buffer
      },
      ease: "none",
      scrollTrigger: {
        trigger: timelineWrapper,
        start: "top 120px", // Starts exactly when sticky hits the 120px top offset
        end: "bottom bottom",
        scrub: 1,
        invalidateOnRefresh: true
      }
    });
  });
}

// ── Inicialização final: sincroniza Lenis com a posição restaurada e ativa ─
function finalizeScrollSetup() {
  // Posição que o browser restaurou no reload (F5) — mantém onde o usuário estava
  const restoredScroll = window.scrollY;
  lenis.scrollTo(restoredScroll, { immediate: true, force: true });

  // ── Profile cards — dim suave nos outros cards no hover ───────────────
  const profileCards = document.querySelectorAll('.card-profile');
  if (profileCards.length && !reduceMotion && window.matchMedia('(hover: hover)').matches) {
    profileCards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        profileCards.forEach((c) => { if (c !== card) c.classList.add('dimmed'); });
      });
      card.addEventListener('mouseleave', () => {
        profileCards.forEach((c) => c.classList.remove('dimmed'));
      });
    });
  }

  // Refresh do ScrollTrigger com posições corretas
  ScrollTrigger.refresh();

  // Re-sincronizar após o refresh (pins/seções podem ter recalculado a altura)
  lenis.scrollTo(restoredScroll, { immediate: true, force: true });

  // Agora sim: ativar smooth scroll do Lenis
  lenis.start();
}

// Se a página já carregou (ex: script defer), rodar direto
if (document.readyState === 'complete') {
  requestAnimationFrame(() => finalizeScrollSetup());
} else {
  window.addEventListener('load', () => {
    requestAnimationFrame(() => finalizeScrollSetup());
  }, { once: true });
}


// Teclado nas abas; as setas seguem a direção de leitura.
function keyboardTabs(buttons, activate) {
  buttons.forEach((button, index) => button.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    let next;
    const rtl = document.documentElement.dir === 'rtl';
    if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = buttons.length - 1;
    else next = (index + ((event.key === 'ArrowRight') !== rtl ? 1 : -1) + buttons.length) % buttons.length;
    buttons[next].focus();
    activate(buttons[next]);
  }));
}
keyboardTabs(Array.from(techButtons), (button) => button.click());
keyboardTabs(icpTabs, (button) => button.click());

// Preserved horizontal card journey, driven by the same smooth scroll engine.
const profileWrapper = document.getElementById('profiles-scroll-wrapper');
const profileTrack = document.getElementById('profiles-track');
gsap.matchMedia().add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
  if (!profileWrapper || !profileTrack || document.documentElement.dir === 'rtl') return;
  gsap.to(profileTrack, {
    x: () => (document.documentElement.dir === 'rtl' ? 1 : -1) * Math.max(0, profileTrack.scrollWidth - window.innerWidth + 64),
    ease: 'none',
    scrollTrigger: { trigger: profileWrapper, start: 'top top', end: 'bottom bottom', scrub: 1, invalidateOnRefresh: true },
  });
});

// Reference Mutual: manifesto sequence, atmospheric drift and subtle media parallax.
if (!reduceMotion && !cleanLayout) {
  if (document.getElementById('manifesto-grid')) gsap.from('#manifesto-grid .s-card', {
    y: 24, stagger: 0.12, duration: 0.8, ease: 'power2.out',
    scrollTrigger: { trigger: '#manifesto-grid', start: 'top 85%', once: true },
  });
  gsap.utils.toArray('.story-figure:not(.hero-story)').forEach((figure) => {
    gsap.fromTo(figure, { y: 24 }, { y: -16, ease: 'none', scrollTrigger: { trigger: figure, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
}

initHomeMotion({ gsap, reduceMotion });

// Sinal local usado pela revisão automatizada de interface.
document.documentElement.dataset.animationsReady = 'true';
