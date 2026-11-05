import { formatUserAnswerLabel } from '../../domain/progress-store.ts'
import type { ProgressStore } from '../../domain/progress-store.ts'
import type { CategoryCode } from '../../domain/types.ts'

/** Last incorrect answer from stored sessions, if any. */
export function getLastWrongAnswerLabel(
  progress: ProgressStore,
  number: string,
  category: CategoryCode,
): string | null {
  for (const session of progress.listSessions(category)) {
    for (let i = session.answers.length - 1; i >= 0; i -= 1) {
      const row = session.answers[i]
      if (row?.number === number && !row.correct) {
        return formatUserAnswerLabel(row.userAnswer)
      }
    }
  }
  return null
}
