const plNumber = new Intl.NumberFormat('pl-PL')

export function formatImportWorkbookCount(value: number): string {
  return plNumber.format(value)
}

/** Short numeric date to match Figma result rows (dd.MM.yyyy). */
export function formatImportWorkbookCatalogDate(isoOrHttpDate: string | null): string {
  if (!isoOrHttpDate) {
    return '—'
  }
  const parsed = Date.parse(isoOrHttpDate)
  if (Number.isNaN(parsed)) {
    return isoOrHttpDate
  }
  return new Intl.DateTimeFormat('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(parsed)
}
