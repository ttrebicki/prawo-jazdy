import type { CategoryCode, MediaKind } from './types.ts'

const CATEGORY_PATTERN =
  /^(AM|A1|A2|A|B1|B|C1|C|D1|D|T|PT)$/

export function parseCategoryCodes(raw: string): CategoryCode[] {
  if (!raw.trim()) {
    return []
  }
  const parts = raw.split(/[,;]\s*/).map((p) => p.trim())
  const codes: CategoryCode[] = []
  for (const part of parts) {
    if (CATEGORY_PATTERN.test(part)) {
      codes.push(part as CategoryCode)
    }
  }
  return codes
}

export function classifyMediaFilename(
  filename: string | null | undefined,
): MediaKind {
  if (!filename || !String(filename).trim()) {
    return 'none'
  }
  const lower = String(filename).trim().toLowerCase()
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) {
    return 'image'
  }
  if (lower.endsWith('.wmv')) {
    return 'video'
  }
  return 'none'
}
