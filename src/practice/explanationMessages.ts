/** Shown when the learner opens “Dlaczego” but nothing is stored for this number. */
export const MISSING_QUESTION_EXPLANATION =
  'To pytanie nie ma jeszcze wyjaśnienia.'

export function displayExplanationText(stored: string | null): string {
  const trimmed = stored?.trim()
  return trimmed ? trimmed : MISSING_QUESTION_EXPLANATION
}
