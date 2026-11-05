/** Polish grouping for summary counts (e.g. 2430 → "2 430"). */
export function formatPlNumber(value: number): string {
  const intl = new Intl.NumberFormat('pl-PL').format(value).replace(/\u00a0|\u202f/g, ' ')
  if (intl.includes(' ')) {
    return intl
  }
  const sign = value < 0 ? '−' : ''
  const abs = Math.abs(Math.trunc(value)).toString()
  return sign + abs.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

/** Headline size from constants label (e.g. "ok. 9,5 GB" → "9,5 GB"). */
export function displayArchiveSizeHeadline(sizeLabel: string): string {
  return sizeLabel.replace(/^ok\.\s*/i, '').trim()
}
