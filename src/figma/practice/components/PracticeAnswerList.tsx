import type { UserAnswer } from '../../../domain/progress-store.ts'
import type { QuestionRecord } from '../../../domain/types.ts'
import type { FigmaPracticeAssets } from '../assets.ts'

type AnswerMode = 'pick' | 'review'

interface PracticeAnswerListProps {
  question: QuestionRecord
  assets: FigmaPracticeAssets
  mode: AnswerMode
  selected: UserAnswer | null
  picked: UserAnswer | null
  correctKey: UserAnswer
  onSelect?: (answer: UserAnswer) => void
}

function basicLabel(key: 'T' | 'N'): string {
  return key === 'T' ? 'TAK' : 'NIE'
}

function specialistCaption(
  question: QuestionRecord,
  key: 'A' | 'B' | 'C',
): string {
  if (key === 'A') {
    return question.answerA ?? ''
  }
  if (key === 'B') {
    return question.answerB ?? ''
  }
  return question.answerC ?? ''
}

function rowClass(
  mode: AnswerMode,
  answer: UserAnswer,
  selected: UserAnswer | null,
  picked: UserAnswer | null,
  correctKey: UserAnswer,
): string {
  if (mode === 'pick') {
    return answer === selected ? 'fp-answer fp-answer--selected' : 'fp-answer'
  }
  if (answer === picked && answer !== correctKey) {
    return 'fp-answer fp-answer--wrong'
  }
  if (answer === correctKey) {
    return 'fp-answer fp-answer--correct'
  }
  return 'fp-answer'
}

function trailingIcon(
  mode: AnswerMode,
  answer: UserAnswer,
  assets: FigmaPracticeAssets,
  selected: UserAnswer | null,
  picked: UserAnswer | null,
  correctKey: UserAnswer,
): { src: string; tag?: string } {
  if (mode === 'pick') {
    return {
      src: answer === selected ? assets.circleDot : assets.circle,
    }
  }
  if (answer === picked && answer !== correctKey) {
    return { src: assets.circleX, tag: 'Twój wybór' }
  }
  if (answer === correctKey) {
    return { src: assets.circleCheck, tag: 'Poprawna' }
  }
  return { src: assets.circle }
}

export function PracticeAnswerList({
  question,
  assets,
  mode,
  selected,
  picked,
  correctKey,
  onSelect,
}: PracticeAnswerListProps) {
  if (question.scope === 'basic') {
    const keys: ('T' | 'N')[] = ['T', 'N']
    return (
      <div className="fp-answers">
        {keys.map((key) => {
          const { src, tag } = trailingIcon(
            mode,
            key,
            assets,
            selected,
            picked,
            correctKey,
          )
          return (
            <button
              key={key}
              type="button"
              className={rowClass(mode, key, selected, picked, correctKey)}
              disabled={mode === 'review'}
              onClick={() => onSelect?.(key)}
            >
              <span className="fp-answer-label">{basicLabel(key)}</span>
              {tag ? <span className="fp-answer-tag">{tag}</span> : null}
              <img className="fp-icon fp-icon--20" src={src} alt="" />
            </button>
          )
        })}
      </div>
    )
  }

  const keys: ('A' | 'B' | 'C')[] = ['A', 'B', 'C']
  return (
    <div className="fp-answers">
      {keys.map((key) => {
        const { src, tag } = trailingIcon(
          mode,
          key,
          assets,
          selected,
          picked,
          correctKey,
        )
        return (
          <button
            key={key}
            type="button"
            className={rowClass(mode, key, selected, picked, correctKey)}
            disabled={mode === 'review'}
            onClick={() => onSelect?.(key)}
          >
            <span className="fp-answer-letter">{key}</span>
            <span className="fp-answer-label fp-answer-label--abc">
              {specialistCaption(question, key)}
            </span>
            {tag ? <span className="fp-answer-tag">{tag}</span> : null}
            <img className="fp-icon fp-icon--20" src={src} alt="" />
          </button>
        )
      })}
    </div>
  )
}
