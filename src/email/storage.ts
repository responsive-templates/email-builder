import type { EmailDocument } from './types';

const STORAGE_KEY = 'free_email_builder_active_doc_v1';

export function saveDocumentLocally(doc: EmailDocument): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(doc));
    return true;
  } catch {
    return false;
  }
}

export function loadDocumentLocally(): EmailDocument | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    return isValidEmailDocument(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function clearLocalDocument(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore storage errors in restricted environments
  }
}

export function isValidEmailDocument(data: unknown): data is EmailDocument {
  if (!data || typeof data !== 'object') return false;
  const candidate = data as Partial<EmailDocument>;
  if (candidate.version !== 1) return false;
  if (typeof candidate.name !== 'string') return false;
  if (!candidate.settings || typeof candidate.settings !== 'object') return false;
  if (!Array.isArray(candidate.blocks)) return false;
  return candidate.blocks.every(
    (b) => b && typeof b === 'object' && typeof b.id === 'string' && typeof b.type === 'string' && 'props' in b,
  );
}

export function exportDocumentJson(doc: EmailDocument): string {
  return JSON.stringify(doc, null, 2);
}

export function parseImportedDocumentJson(raw: string): EmailDocument {
  const parsed = JSON.parse(raw) as unknown;
  if (!isValidEmailDocument(parsed)) {
    throw new Error('Invalid email builder JSON format. Expected version 1 document.');
  }
  return parsed;
}

export function downloadFile(filename: string, content: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
