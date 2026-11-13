// Estado efêmero: somente caixas nativas e texto na página, sem armazenamento ou envio.
export function initNeedsChecklist() {
  const checklist = document.querySelector('[data-needs-checklist]');
  if (!checklist) return;
  const inputs = [...checklist.querySelectorAll('input[type="checkbox"]')];
  const count = checklist.querySelector('[data-needs-count]');
  const number = new Intl.NumberFormat(document.documentElement.lang);
  const update = () => {
    count.textContent = number.format(inputs.filter(input => input.checked).length);
  };
  checklist.addEventListener('change', update);
  window.addEventListener('pageshow', update);
  update();
}
