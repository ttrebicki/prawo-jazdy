import type { QuestionScope } from './types.ts'

const DIACRITICS = /[\u0300-\u036f]/g

function fold(value: string): string {
  return value
    .trim()
    .normalize('NFD')
    .replace(DIACRITICS, '')
    .toLowerCase()
}

/** Maps official scope labels (including odd capitals and the `Specajlistyczny` typo). */
export function normalizeScope(raw: string): QuestionScope | null {
  const text = fold(raw)
  if (!text) {
    return null
  }
  if (text.includes('podstaw')) {
    return 'basic'
  }
  if (/spec[a-z]*list/.test(text)) {
    return 'specialist'
  }
  return null
}
