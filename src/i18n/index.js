import { languages, languagePath, resolvePath } from '../../config/routes.js';
export { languages, languagePath };
export function initI18n() {
  const url = new URL(location.href);
  const { page = 'home' } = resolvePath(url.pathname);
  const requested = url.searchParams.get('lang');
  if (languages.includes(requested)) {
    url.pathname = languagePath(requested,page); url.searchParams.delete('lang');
    location.replace(url.href);
  }
  const language = document.documentElement.lang;
  const dictionary = JSON.parse(document.getElementById('runtime-copy').textContent);
  for (const selector of document.querySelectorAll('#language-select, [data-language-select]')) {
    selector.value = language;
    selector.addEventListener('change', () => {
      url.pathname = languagePath(selector.value,page); url.searchParams.delete('lang');
      location.assign(url.href);
    });
  }
  return { language, translate: (key) => dictionary[key] };
}
