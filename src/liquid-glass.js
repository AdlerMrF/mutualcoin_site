// Liquid glass em JS puro: mesma técnica do liquid-glass-react (mapa de deslocamento em
// filtro SVG + aberração cromática + resposta ao ponteiro), sem React.
// A refração só existe em Chromium; nos demais navegadores fica o vidro fosco do CSS.
// Compatível com a política de conteúdo: nada de atributo style; só CSSOM e imagem data:.
const SVG_NS = 'http://www.w3.org/2000/svg';
const XLINK_NS = 'http://www.w3.org/1999/xlink';
const MAP_MAX = 512;

const targets = [
  { selector: '#navbar-center', scale: 44, bezel: 22, aberration: 0.12 },
  { selector: '.ghost-cta', scale: 28, bezel: 14, aberration: 0.15, elastic: true },
  { selector: '.enterprise-proof-rail', scale: 36, bezel: 20, aberration: 0.1 },
];

const node = (name, attributes = {}) => {
  const element = document.createElementNS(SVG_NS, name);
  for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, value);
  return element;
};

// R/G codificam o deslocamento: a borda amostra o conteúdo mais para dentro (lente convexa);
// o miolo fica neutro (128) e não se move.
function displacementMap(width, height, radius, bezel) {
  const ratio = Math.min(1, MAP_MAX / Math.max(width, height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(2, Math.round(width * ratio));
  canvas.height = Math.max(2, Math.round(height * ratio));
  const context = canvas.getContext('2d');
  const image = context.createImageData(canvas.width, canvas.height);
  const halfW = width / 2, halfH = height / 2;
  for (let py = 0; py < canvas.height; py++) for (let px = 0; px < canvas.width; px++) {
    const x = (px + 0.5) / ratio - halfW, y = (py + 0.5) / ratio - halfH;
    const qx = Math.abs(x) - (halfW - radius), qy = Math.abs(y) - (halfH - radius);
    const cornerX = Math.max(qx, 0), cornerY = Math.max(qy, 0);
    const corner = Math.hypot(cornerX, cornerY);
    const inside = -(Math.min(Math.max(qx, qy), 0) + corner - radius);
    let nx = 0, ny = 0;
    if (corner > 0) { nx = cornerX / corner * Math.sign(x); ny = cornerY / corner * Math.sign(y); }
    else if (qx > qy) nx = Math.sign(x);
    else ny = Math.sign(y);
    const edge = 1 - Math.min(Math.max(inside / bezel, 0), 1);
    const strength = edge * edge;
    const index = (py * canvas.width + px) * 4;
    image.data[index] = 128 - nx * strength * 127;
    image.data[index + 1] = 128 - ny * strength * 127;
    image.data[index + 2] = 128;
    image.data[index + 3] = 255;
  }
  context.putImageData(image, 0, 0);
  return canvas.toDataURL('image/png');
}

function buildFilter(id, { scale, aberration }) {
  const filter = node('filter', { id, x: '0', y: '0', width: '100%', height: '100%', 'color-interpolation-filters': 'sRGB' });
  const map = node('feImage', { x: '0', y: '0', width: '1', height: '1', preserveAspectRatio: 'none', result: 'map' });
  filter.append(map);
  const channels = aberration ? [
    ['1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0', scale * (1 + aberration)],
    ['0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0', scale],
    ['0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0', scale * (1 - aberration)],
  ] : [[null, scale]];
  channels.forEach(([matrix, amount], index) => {
    filter.append(node('feDisplacementMap', { in: 'SourceGraphic', in2: 'map', scale: String(amount), xChannelSelector: 'R', yChannelSelector: 'G', result: `shift${index}` }));
    if (matrix) filter.append(node('feColorMatrix', { in: `shift${index}`, type: 'matrix', values: matrix, result: `channel${index}` }));
  });
  if (aberration) {
    filter.append(node('feBlend', { in: 'channel0', in2: 'channel1', mode: 'screen', result: 'mix' }));
    filter.append(node('feBlend', { in: 'mix', in2: 'channel2', mode: 'screen' }));
  }
  return { filter, map };
}

function refract(element, options, defs, id) {
  const { filter, map } = buildFilter(id, options);
  defs.append(filter);
  let timer = 0, drawn = '';
  const draw = () => {
    const width = element.offsetWidth, height = element.offsetHeight;
    if (!width || !height) return;
    const limit = Math.min(width, height) / 2;
    const radius = Math.min(parseFloat(getComputedStyle(element).borderTopLeftRadius) || 0, limit);
    const key = `${width}x${height}r${radius}`;
    if (key === drawn) return;
    drawn = key;
    const url = displacementMap(width, height, radius, Math.min(options.bezel, limit));
    map.setAttribute('href', url);
    map.setAttributeNS(XLINK_NS, 'xlink:href', url);
    element.style.setProperty('--lg-refraction', `url(#${id})`);
  };
  new ResizeObserver(() => {
    // O mapa estica de imediato com a caixa; o redesenho exato espera a medida estabilizar.
    map.setAttribute('width', String(element.offsetWidth || 1));
    map.setAttribute('height', String(element.offsetHeight || 1));
    clearTimeout(timer);
    timer = setTimeout(draw, drawn ? 140 : 0);
  }).observe(element);
}

function followPointer(element, elastic) {
  let frame = 0, last = null;
  const apply = () => {
    frame = 0;
    const box = element.getBoundingClientRect();
    const x = (last.clientX - box.left) / box.width, y = (last.clientY - box.top) / box.height;
    element.style.setProperty('--lg-x', `${(x * 100).toFixed(1)}%`);
    element.style.setProperty('--lg-y', `${(y * 100).toFixed(1)}%`);
    if (elastic) {
      element.style.setProperty('--lg-tx', `${((x - 0.5) * 6).toFixed(2)}px`);
      element.style.setProperty('--lg-ty', `${((y - 0.5) * 4).toFixed(2)}px`);
    }
  };
  element.addEventListener('pointermove', (event) => { last = event; frame ||= requestAnimationFrame(apply); }, { passive: true });
  element.addEventListener('pointerleave', () => {
    cancelAnimationFrame(frame);
    frame = 0;
    for (const name of ['--lg-x', '--lg-y', '--lg-tx', '--lg-ty']) element.style.removeProperty(name);
  }, { passive: true });
}

export function initLiquidGlass() {
  const plain = matchMedia('(prefers-reduced-transparency: reduce), (prefers-contrast: more), (forced-colors: active)').matches;
  if (plain) return;
  // backdrop-filter com url() só é desenhado pelo Chromium; CSS.supports não distingue isso.
  const chromium = Boolean(navigator.userAgentData) || /Chrome\//.test(navigator.userAgent);
  const pointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let defs = null, count = 0;
  for (const options of targets) for (const element of document.querySelectorAll(options.selector)) {
    element.classList.add('liquid-glass');
    if (chromium) {
      if (!defs) {
        const svg = node('svg', { class: 'liquid-glass-defs', width: '0', height: '0', 'aria-hidden': 'true', focusable: 'false' });
        defs = node('defs');
        svg.append(defs);
        document.body.append(svg);
      }
      refract(element, options, defs, `liquid-glass-${++count}`);
    }
    if (pointer) {
      const elastic = Boolean(options.elastic) && !still;
      if (elastic) element.classList.add('liquid-glass-elastic');
      followPointer(element, elastic);
    }
  }
}
