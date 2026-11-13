import { governanceDocuments, publicDirectory, publishedFile, validateGovernanceDocuments } from './governance.js';

const escape = (value) => String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export function renderGovernanceDocuments(language, documents = governanceDocuments, directory = publicDirectory) {
  validateGovernanceDocuments(documents, directory);
  return `<section id="governance-documents" class="b-section governance-documents"><div class="site-container"><ul class="governance-list" role="list" data-i18n-aria-label="governance.list">${documents.map(document => {
    const id = `document-${document.id}`;
    const file = publishedFile(document, directory);
    const action = file
      ? `<a class="document-action" href="${escape(file)}" download target="_blank" rel="noopener" aria-describedby="${id}-title ${id}-status" data-i18n="governance.download"></a>`
      : `<button class="document-action" type="button" disabled aria-describedby="${id}-title ${id}-status ${id}-note" data-i18n="governance.download"></button>`;
    return `<li data-document-id="${document.id}" data-document-state="${document.estado}" aria-labelledby="${id}-title" aria-describedby="${id}-status${file ? '' : ` ${id}-note`}"><div class="document-copy"><h2 id="${id}-title">${escape(document.nome[language])} <bdi class="document-version">— ${document.codigo} · v${document.versao}</bdi></h2><span id="${id}-status" class="document-status" data-i18n="governance.${file ? 'published' : 'draft'}"></span>${file ? '' : `<p id="${id}-note" class="document-note" data-i18n="governance.note"></p>`}</div><div class="document-controls"><span class="document-format">PDF</span>${action}</div></li>`;
  }).join('')}</ul></div></section>`;
}
