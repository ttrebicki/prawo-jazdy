export function formatListDate(iso: string | null | undefined): string {
  if (!iso) {
    return new Intl.DateTimeFormat('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date())
  }
  const parsed = new Date(iso)
  if (Number.isNaN(parsed.getTime())) {
    return formatListDate(null)
  }
  return new Intl.DateTimeFormat('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(parsed)
}

export function answerTypeLabel(scope: 'basic' | 'specialist'): string {
  return scope === 'basic' ? 'TAK / NIE' : 'A / B / C'
}

export function mistakeCountKicker(count: number, category: string): string {
  if (count === 1) {
    return `KATEGORIA ${category} · 1 PYTANIE`
  }
  const mod10 = count % 10
  const mod100 = count % 100
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return `KATEGORIA ${category} · ${count} PYTANIA`
  }
  return `KATEGORIA ${category} · ${count} PYTAŃ`
}
