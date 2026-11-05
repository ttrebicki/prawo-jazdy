/** Fallback catalog date when metadata is missing (Figma sample). */
export const START_DEMO_CATALOG_DATE = '03.11.2026'

/** Catalog line 1 prefix — always shown with a dd.MM.yyyy date. */
export const START_CATALOG_LINE_ONE_PREFIX = 'Dane pokazowe · katalog z'

/** Placeholder stats matching the Figma start screen. */
export const START_SAMPLE_PRACTICE_ANSWERS = '48 odpowiedzi w ćwiczeniach'
export const START_SAMPLE_MISTAKES = '12 błędów'

/** Formats catalog metadata as dd.MM.yyyy for the start screen only. */
export function formatStartCatalogDate(isoOrHttpDate: string | null): string {
  if (!isoOrHttpDate) {
    return START_DEMO_CATALOG_DATE
  }
  const parsed = Date.parse(isoOrHttpDate)
  if (Number.isNaN(parsed)) {
    return START_DEMO_CATALOG_DATE
  }
  const date = new Date(parsed)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}.${month}.${year}`
}

export function buildStartCatalogLineOne(lastModified: string | null): string {
  return `${START_CATALOG_LINE_ONE_PREFIX} ${formatStartCatalogDate(lastModified)}`
}

export function buildStartCatalogLineTwo(
  questionCount: number,
  missingMediaCount: number,
  formatCount: Intl.NumberFormat,
): string {
  return `${formatCount.format(questionCount)} pytań B · ${formatCount.format(missingMediaCount)} bez użytecznych mediów`
}
