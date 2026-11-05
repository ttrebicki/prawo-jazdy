export function formatListDate(iso: string | null | undefined): string | null {
  if (!iso) {
    return null
  }
  const parsed = new Date(iso)
  if (Number.isNaN(parsed.getTime())) {
    return null
  }
  return new Intl.DateTimeFormat('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(parsed)
}

function polishQuestionWord(count: number): string {
  if (count === 1) {
    return 'pytanie'
  }
  const mod10 = count % 10
  const mod100 = count % 100
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return 'pytania'
  }
  return 'pytań'
}

export function showRemainingQuestionsLabel(count: number): string {
  return `Pokaż pozostałe ${count} ${polishQuestionWord(count)}`
}

export function answerTypeLabel(scope: 'basic' | 'specialist'): string {
  return scope === 'basic' ? 'TAK / NIE' : 'A / B / C'
}

export function mistakeCountKicker(count: number, category: string): string {
  const word = polishQuestionWord(count).toUpperCase()
  if (count === 1) {
    return `KATEGORIA ${category} · 1 ${word}`
  }
  return `KATEGORIA ${category} · ${count} ${word}`
}
