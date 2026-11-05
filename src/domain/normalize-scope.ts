import type { QuestionScope } from './types.ts'

const BASIC_ALIASES = new Set([
  'podstawowy',
  'PODSTAWOWY',
  'Podstawowy',
])

const SPECIALIST_ALIASES = new Set([
  'specjalistyczny',
  'SPECJALISTYCZNY',
  'Specjalistyczny',
  'specajlistyczny',
  'Specajlistyczny',
])

export function normalizeScope(raw: string): QuestionScope | null {
  const trimmed = raw.trim()
  if (BASIC_ALIASES.has(trimmed) || trimmed.toLowerCase() === 'podstawowy') {
    return 'basic'
  }
  if (
    SPECIALIST_ALIASES.has(trimmed) ||
    trimmed.toLowerCase() === 'specjalistyczny' ||
    trimmed.toLowerCase() === 'specajlistyczny'
  ) {
    return 'specialist'
  }
  return null
}
