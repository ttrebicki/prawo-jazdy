import { formatUserAnswerLabel, type UserAnswer } from '../../domain/progress-store.ts'
import type { QuestionRecord } from '../../domain/types.ts'

interface FeedbackPanelProps {
  question: QuestionRecord
  picked: UserAnswer
  correctKey: UserAnswer
  mediaViewable: boolean
  whyText: string | null
  onContinue: () => void
}

export function FeedbackPanel({
  question,
  picked,
  correctKey,
  mediaViewable,
  whyText,
  onContinue,
}: FeedbackPanelProps) {
  const isCorrect = picked === correctKey
  const showMasteryNote =
    isCorrect && !mediaViewable && question.mediaKind !== 'none'

  return (
    <div className="practice-feedback">
      <p
        className={
          isCorrect
            ? 'practice-feedback-word practice-feedback-correct'
            : 'practice-feedback-word practice-feedback-incorrect'
        }
      >
        {isCorrect ? 'Poprawnie' : 'Błędnie'}
      </p>
      <dl className="practice-feedback-answers">
        <div>
          <dt>Twoja odpowiedź</dt>
          <dd>{formatUserAnswerLabel(picked)}</dd>
        </div>
        <div>
          <dt>Prawidłowa odpowiedź</dt>
          <dd>{formatUserAnswerLabel(correctKey)}</dd>
        </div>
      </dl>
      {showMasteryNote && (
        <p className="practice-muted">
          Bez obrazu lub klipu odpowiedź nie jest zaliczana jako opanowanie.
        </p>
      )}
      {whyText ? (
        <section className="practice-why" aria-labelledby="practice-why-title">
          <h2 id="practice-why-title" className="practice-why-title">
            Dlaczego
          </h2>
          <p className="practice-why-text">{whyText}</p>
        </section>
      ) : null}
      <button type="button" className="practice-btn" onClick={onContinue}>
        Dalej
      </button>
    </div>
  )
}
