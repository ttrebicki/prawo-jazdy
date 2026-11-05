import {
  formatUserAnswerLabel,
  type UserAnswer,
} from '../../../domain/progress-store.ts'

interface PracticeResultBlockProps {
  isCorrect: boolean
  correctKey: UserAnswer
}

export function PracticeResultBlock({
  isCorrect,
  correctKey,
}: PracticeResultBlockProps) {
  if (isCorrect) {
    return (
      <div className="fp-result-block">
        <p className="fp-result-title fp-result-title--correct">
          Poprawna odpowiedź
        </p>
        <p className="fp-result-copy">
          Dobrze — wybrałeś {formatUserAnswerLabel(correctKey)}.
        </p>
      </div>
    )
  }

  return (
    <div className="fp-result-block">
      <p className="fp-result-title fp-result-title--wrong">
        Niepoprawna odpowiedź
      </p>
      <p className="fp-result-copy">
        Poprawna odpowiedź w makiecie: {formatUserAnswerLabel(correctKey)}.
        <br />
        Pytanie zapisane na liście Błędy.
      </p>
    </div>
  )
}
