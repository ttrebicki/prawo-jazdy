import type { QuestionRecord } from '../../domain/types.ts'
import type { ProgressStore } from '../../domain/progress-store.ts'

interface MistakesViewProps {
  progress: ProgressStore
  getQuestion: (number: string) => QuestionRecord | undefined
  onOpen: (question: QuestionRecord) => void
  onBack: () => void
}

export function MistakesView({
  progress,
  getQuestion,
  onOpen,
  onBack,
}: MistakesViewProps) {
  const mistakes = progress.listMistakes('B')

  return (
    <div className="stack">
      <button type="button" className="btn btn-ghost" onClick={onBack}>
        ← Wróć
      </button>
      <h1 className="page-title">Błędy — kategoria B</h1>
      {mistakes.length === 0 ? (
        <p className="muted">Brak zapisanych błędów. Ćwicz dalej.</p>
      ) : (
        <div className="stack">
          {mistakes.map((entry) => {
            const question = getQuestion(entry.number)
            if (!question) {
              return null
            }
            return (
              <button
                key={entry.number}
                type="button"
                className="btn btn-secondary"
                onClick={() => onOpen(question)}
              >
                Nr {question.number} · {question.prompt.slice(0, 80)}
                {question.prompt.length > 80 ? '…' : ''}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
