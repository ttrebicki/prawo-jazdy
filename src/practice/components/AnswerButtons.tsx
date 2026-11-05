import type { QuestionRecord } from '../../domain/types.ts'
import type { UserAnswer } from '../../domain/progress-store.ts'

interface AnswerButtonsProps {
  question: QuestionRecord
  disabled: boolean
  onPick: (answer: UserAnswer) => void
}

const SPECIALIST_KEYS = ['A', 'B', 'C'] as const

function specialistAnswerText(
  question: QuestionRecord,
  key: (typeof SPECIALIST_KEYS)[number],
): string {
  if (key === 'A') {
    return question.answerA ?? ''
  }
  if (key === 'B') {
    return question.answerB ?? ''
  }
  return question.answerC ?? ''
}

export function AnswerButtons({
  question,
  disabled,
  onPick,
}: AnswerButtonsProps) {
  if (question.scope === 'basic') {
    return (
      <div className="practice-answers">
        <button
          type="button"
          className="practice-btn"
          disabled={disabled}
          onClick={() => onPick('T')}
        >
          TAK
        </button>
        <button
          type="button"
          className="practice-btn"
          disabled={disabled}
          onClick={() => onPick('N')}
        >
          NIE
        </button>
      </div>
    )
  }

  return (
    <div className="practice-answers">
      {SPECIALIST_KEYS.map((key) => (
        <button
          key={key}
          type="button"
          className="practice-btn practice-btn-specialist"
          disabled={disabled}
          onClick={() => onPick(key)}
        >
          <span className="practice-btn-letter">{key}</span>
          <span className="practice-btn-caption">
            {specialistAnswerText(question, key)}
          </span>
        </button>
      ))}
    </div>
  )
}
