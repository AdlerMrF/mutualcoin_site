import { realpathSync, statSync } from 'node:fs';
import { resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { languages } from './routes.js';

/** @typedef {{ id: string, nome: Record<string, string>, codigo: string, versao: string, estado: 'em_elaboracao' | 'publicado', arquivo: string | null }} GovernanceDocument */

/** @type {GovernanceDocument[]} */
export const governanceDocuments = [
  {
    id: 'pld-aml', codigo: 'MC-GOV-001', versao: '1.0', estado: 'em_elaboracao', arquivo: null,
    nome: {
      'pt-BR': 'Política PLD/AML', en: 'AML Policy', es: 'Política de prevención del blanqueo de capitales',
      de: 'Richtlinie zur Geldwäscheprävention', it: 'Politica antiriciclaggio', ja: 'マネーロンダリング防止方針', ar: 'سياسة مكافحة غسل الأموال',
    },
  },
  {
    id: 'privacidade-lgpd', codigo: 'MC-GOV-002', versao: '1.0', estado: 'em_elaboracao', arquivo: null,
    nome: {
      'pt-BR': 'Política de Privacidade (LGPD)', en: 'Privacy Policy (LGPD)', es: 'Política de privacidad (LGPD)',
      de: 'Datenschutzrichtlinie (LGPD)', it: 'Informativa sulla privacy (LGPD)', ja: 'プライバシーポリシー（LGPD）', ar: 'سياسة الخصوصية (LGPD)',
    },
  },
  {
    id: 'seguranca-informacao', codigo: 'MC-GOV-003', versao: '1.0', estado: 'em_elaboracao', arquivo: null,
    nome: {
      'pt-BR': 'Declaração de Segurança da Informação', en: 'Information Security Statement', es: 'Declaración de seguridad de la información',
      de: 'Erklärung zur Informationssicherheit', it: 'Dichiarazione sulla sicurezza delle informazioni', ja: '情報セキュリティ声明', ar: 'بيان أمن المعلومات',
    },
  },
  {
    id: 'etica-conduta', codigo: 'MC-GOV-004', versao: '1.0', estado: 'em_elaboracao', arquivo: null,
    nome: {
      'pt-BR': 'Código de Ética e Conduta', en: 'Code of Ethics and Conduct', es: 'Código de ética y conducta',
      de: 'Ethik- und Verhaltenskodex', it: 'Codice etico e di condotta', ja: '倫理・行動規範', ar: 'مدونة الأخلاق والسلوك',
    },
  },
  {
    id: 'alocacao-capital', codigo: 'MC-GOV-005', versao: '1.0', estado: 'em_elaboracao', arquivo: null,
    nome: {
      'pt-BR': 'Declaração de Governança de Alocação de Capital', en: 'Capital Allocation Governance Statement', es: 'Declaración de gobernanza de la asignación de capital',
      de: 'Erklärung zur Governance der Kapitalallokation', it: 'Dichiarazione sulla governance dell’allocazione del capitale', ja: '資本配分ガバナンス声明', ar: 'بيان حوكمة تخصيص رأس المال',
    },
  },
  {
    id: 'termos-uso', codigo: 'MC-GOV-006', versao: '1.0', estado: 'em_elaboracao', arquivo: null,
    nome: {
      'pt-BR': 'Termos de Uso', en: 'Terms of Use', es: 'Términos de uso',
      de: 'Nutzungsbedingungen', it: 'Termini di utilizzo', ja: '利用規約', ar: 'شروط الاستخدام',
    },
  },
  {
    id: 'capacitacao', codigo: 'MC-GOV-007', versao: '1.0', estado: 'em_elaboracao', arquivo: null,
    nome: {
      'pt-BR': 'Declaração de Capacitação', en: 'Training Statement', es: 'Declaración de capacitación',
      de: 'Schulungserklärung', it: 'Dichiarazione di formazione', ja: '研修声明', ar: 'بيان التدريب',
    },
  },
  {
    id: 'atestacao-asseguracao', codigo: 'MC-GOV-008', versao: '1.0', estado: 'em_elaboracao', arquivo: null,
    nome: {
      'pt-BR': 'Plano de Atestação e Asseguração', en: 'Attestation and Assurance Plan', es: 'Plan de atestación y aseguramiento',
      de: 'Plan für Attestierung und Prüfungssicherheit', it: 'Piano di attestazione e assurance', ja: '証明・保証計画', ar: 'خطة الإقرار والتأكيد',
    },
  },
  {
    id: 'governanca-ia', codigo: 'MC-GOV-009', versao: '1.0', estado: 'em_elaboracao', arquivo: null,
    nome: {
      'pt-BR': 'Política de Governança de IA', en: 'AI Governance Policy', es: 'Política de gobernanza de la IA',
      de: 'Richtlinie zur KI-Governance', it: 'Politica di governance dell’IA', ja: 'AIガバナンス方針', ar: 'سياسة حوكمة الذكاء الاصطناعي',
    },
  },
];

export const publicDirectory = fileURLToPath(new URL('../public/', import.meta.url));

// Só aceita caminhos locais de PDFs reais, inclusive ao resolver atalhos de arquivos.
export function publishedFile(document, directory = publicDirectory) {
  if (document.estado !== 'publicado') return null;
  const file = document.arquivo;
  if (typeof file !== 'string' || !/^\/(?!\/)[\w./-]+\.pdf$/i.test(file) || file.split('/').includes('..')) {
    throw new Error(`Documento publicado sem caminho de PDF válido: ${document.id}`);
  }
  const root = realpathSync(directory);
  let path;
  try { path = realpathSync(resolve(root, `.${file}`)); }
  catch { throw new Error(`PDF publicado ausente em public/: ${document.id}`); }
  if (!path.startsWith(`${root}${sep}`) || !statSync(path).isFile()) {
    throw new Error(`PDF publicado fora de public/ ou sem arquivo: ${document.id}`);
  }
  return file;
}

export function validateGovernanceDocuments(documents = governanceDocuments, directory = publicDirectory) {
  const ids = new Set();
  for (const document of documents) {
    if (!/^[a-z0-9-]+$/.test(document.id) || ids.has(document.id)) throw new Error(`Identificador de documento inválido ou repetido: ${document.id}`);
    ids.add(document.id);
    if (!/^\d+\.\d+$/.test(document.versao)) throw new Error(`Versão de documento inválida: ${document.id}`);
    if (!['em_elaboracao', 'publicado'].includes(document.estado)) throw new Error(`Estado de documento inválido: ${document.id}`);
    if (document.arquivo !== null && typeof document.arquivo !== 'string') throw new Error(`Arquivo de documento inválido: ${document.id}`);
    for (const language of languages) {
      if (typeof document.nome?.[language] !== 'string' || !document.nome[language].trim()) throw new Error(`Nome de documento sem tradução: ${document.id}/${language}`);
    }
    publishedFile(document, directory);
  }
}
