// Free iframe widgets. Provider code runs inside its own origin, never in our DOM.
export function initTradingView() {
  const language = document.documentElement.lang;
  const locale = language === 'pt-BR' ? 'br' : language;
  const labels = JSON.parse(document.getElementById('runtime-copy').textContent);
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const observer = new IntersectionObserver((entries) => {
    for (const { target, isIntersecting } of entries) {
      if (!isIntersecting) continue;
      observer.unobserve(target);
      const kind = target.dataset.tradingview;
      const pauseButton = target.closest('figure').querySelector('.widget-pause');
      const config = {
        width: '100%', height: kind === 'ticker-tape' ? 80 : 420,
        colorTheme: document.documentElement.dataset.theme, isTransparent: true, locale,
        showSymbolLogo: false, largeChartUrl: '',
        ...(kind === 'ticker-tape' ? {
          symbols: [{ proName: 'BITSTAMP:BTCUSD', title: 'BTC / USD' }, { proName: 'BITSTAMP:ETHUSD', title: 'ETH / USD' }, { proName: 'FX_IDC:USDBRL', title: 'USD / BRL' }, { proName: 'FX:EURUSD', title: 'EUR / USD' }],
          displayMode: 'adaptive', showTickerLogo: false,
        } : {
          dateRange: '12M', showChart: true, showFloatingTooltip: false,
          tabs: [{ title: labels['market.assets'], symbols: [{ s: 'BITSTAMP:BTCUSD', d: 'BTC / USD' }, { s: 'BITSTAMP:ETHUSD', d: 'ETH / USD' }, { s: 'FX_IDC:USDBRL', d: 'USD / BRL' }, { s: 'FX:EURUSD', d: 'EUR / USD' }] }],
        }),
        utm_source: location.hostname, utm_medium: 'widget', utm_campaign: kind,
      };
      // A moving ticker is loaded only after an explicit action with reduced motion.
      const mount = () => {
        config.colorTheme = document.documentElement.dataset.theme;
        const frame = document.createElement('iframe');
        frame.src = `https://s.tradingview.com/embed-widget/${kind}/?locale=${locale}#${encodeURIComponent(JSON.stringify(config))}`;
        frame.title = labels[kind === 'ticker-tape' ? 'market.ticker' : 'market.overview'];
        frame.loading = 'lazy'; frame.referrerPolicy = 'strict-origin-when-cross-origin';
        frame.width = '100%'; frame.height = String(config.height);
        frame.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox');
        target.replaceChildren(frame);
        if (pauseButton) {
          pauseButton.disabled = false;
          pauseButton.textContent = labels['market.pause'];
          pauseButton.setAttribute('aria-pressed', 'false');
        }
      };
      if (pauseButton) pauseButton.addEventListener('click', () => {
        const paused = pauseButton.getAttribute('aria-pressed') === 'true';
        if (paused) mount();
        else {
          const message = document.createElement('p'); message.textContent = labels['market.paused'];
          target.replaceChildren(message);
          pauseButton.textContent = labels['market.resume'];
          pauseButton.setAttribute('aria-pressed', 'true');
        }
      });
      document.addEventListener('themechange', () => {
        // Só recria um widget ativo; preserva a pausa e o consentimento de movimento.
        if (target.querySelector('iframe')) mount();
      });
      if (reduceMotion && kind === 'ticker-tape') {
        const button = document.createElement('button'); button.type = 'button';
        button.className = 'widget-load'; button.textContent = labels['market.activate'];
        button.addEventListener('click', mount, { once: true }); target.replaceChildren(button);
      } else mount();
    }
  }, { rootMargin: '160px 0px' });
  document.querySelectorAll('[data-tradingview]').forEach((slot) => observer.observe(slot));
}
