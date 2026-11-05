/** Polish grouping for summary counts (e.g. 2430 → "2 430"). */
export function formatPlNumber(value: number): string {
  return new Intl.NumberFormat('pl-PL').format(value)
}

/** Headline size from constants label (e.g. "ok. 9,5 GB" → "9,5 GB"). */
export function displayArchiveSizeHeadline(sizeLabel: string): string {
  return sizeLabel.replace(/^ok\.\s*/i, '').trim()
}
