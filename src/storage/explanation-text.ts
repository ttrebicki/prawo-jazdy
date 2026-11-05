/** Normalize explanation copy before persisting on device. */
export function normalizeExplanationText(text: string): string | null {
  const trimmed = text.trim()
  return trimmed.length > 0 ? trimmed : null
}
