// Liga o motion por scroll só com suporte a scroll-driven animations e sem movimento reduzido.
const comparison = new URLSearchParams(location.search).get('comparacao');
if (comparison !== 'antes') {
  document.documentElement.setAttribute('data-lp-polish', '');
  document.documentElement.setAttribute('data-mutual-identity', 'org');
}
if (comparison === 'antes' || comparison === 'depois') document.title = `${comparison.toUpperCase()} · ${document.title}`;
if (matchMedia('(prefers-reduced-motion: no-preference)').matches && CSS.supports('animation-timeline: view()')) document.documentElement.setAttribute('data-8b-live', '');
