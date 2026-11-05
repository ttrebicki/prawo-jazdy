import type { CategoryCode, MediaKind } from './types.ts'

const CATEGORY_PATTERN =
  /^(AM|A1|A2|A|B1|B|C1|C|D1|D|T|PT)$/i

export function parseCategoryCodes(raw: string): CategoryCode[] {
  if (!raw.trim()) {
    return []
  }
  const parts = raw.split(/[,;]\s*/).map((p) => p.trim())
  const codes: CategoryCode[] = []
  for (const part of parts) {
    const normalized = part.toUpperCase().replace(/\s+/g, '')
    if (CATEGORY_PATTERN.test(normalized)) {
      codes.push(normalized as CategoryCode)
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
  if (
    lower.endsWith('.jpg') ||
    lower.endsWith('.jpeg') ||
    lower.endsWith('.png')
  ) {
    return 'image'
  }
  if (
    lower.endsWith('.wmv') ||
    lower.endsWith('.mp4') ||
    lower.endsWith('.webm')
  ) {
    return 'video'
  }
  return 'none'
}
