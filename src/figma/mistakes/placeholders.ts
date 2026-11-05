/** Placeholder copy only — no official exam question text in the repo. */
export const PLACEHOLDER_PROMPTS = [
  'Treść zastępcza pytania. Czy przykładowe stwierdzenie jest prawidłowe?',
  'Przykładowa treść pytania z wyborem jednej odpowiedzi.',
  'Treść zastępcza kolejnego pytania demonstracyjnego.',
  'Przykładowe pytanie do ponownego przećwiczenia.',
] as const

export const PLACEHOLDER_LAST_ANSWERS = ['TAK', 'C', 'NIE', 'A'] as const

export function demoQuestionLabel(officialNumber: string): string {
  const digits = officialNumber.replace(/\D/g, '').padStart(4, '0').slice(-4)
  return `DEMO B-${digits}`
}

export function placeholderPrompt(index: number): string {
  return PLACEHOLDER_PROMPTS[index % PLACEHOLDER_PROMPTS.length] ?? PLACEHOLDER_PROMPTS[0]
}

export function placeholderLastAnswerLabel(index: number): string {
  return (
    PLACEHOLDER_LAST_ANSWERS[index % PLACEHOLDER_LAST_ANSWERS.length] ??
    PLACEHOLDER_LAST_ANSWERS[0]
  )
}
