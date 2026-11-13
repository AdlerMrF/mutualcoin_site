import plataforma from './plataforma.json' with { type: 'json' };
export { plataforma };
export const platformPage = (item) => `app-${item.id}`;
export const findPlatformPage = (page) => plataforma.find(item => platformPage(item) === page);
// A mesma lista alimenta rotas, menu, conteúdo, metadados e conferência dos idiomas.
export function platformDictionary(language) {
  return Object.fromEntries(plataforma.flatMap(item => [
    [`nav.${platformPage(item)}`, item.nome[language]],
    [`platform.${item.id}.title`, item.nome[language]],
    [`platform.${item.id}.desc`, item.descricao[language]],
  ]));
}
