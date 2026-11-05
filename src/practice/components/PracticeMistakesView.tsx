import type { QuestionRecord } from '../../domain/types.ts'
import type { PracticeDependencies } from '../types.ts'

interface PracticeMistakesViewProps {
  deps: PracticeDependencies
  onOpenQuestion: (question: QuestionRecord) => void
  onBack: () => void
}

export function PracticeMistakesView({
  deps,
  onOpenQuestion,
  onBack,
}: PracticeMistakesViewProps) {
  const mistakes = deps.progress.listMistakes(deps.category)

  return (
    <div className="practice-setup">
      <button
        type="button"
        className="practice-btn practice-btn-ghost"
        onClick={onBack}
      >
        ← Wróć
      </button>
      <h1 className="practice-title">Błędy — kategoria {deps.category}</h1>
      {mistakes.length === 0 ? (
        <p className="practice-muted">Brak zapisanych błędów. Ćwicz dalej.</p>
      ) : (
        <ul className="practice-mistake-list">
          {mistakes.map((entry) => {
            const question = deps.bank.getByNumber(entry.number)
            if (!question) {
              return null
            }
            const preview =
              question.prompt.length > 80
                ? `${question.prompt.slice(0, 80)}…`
                : question.prompt
            return (
              <li key={entry.number}>
                <button
                  type="button"
                  className="practice-btn practice-btn-secondary"
                  onClick={() => onOpenQuestion(question)}
                >
                  <span className="practice-mistake-number">Nr {question.number}</span>
                  <span className="practice-mistake-preview">{preview}</span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
