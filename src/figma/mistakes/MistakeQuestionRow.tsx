import type { QuestionRecord } from '../../domain/types.ts'
import { answerTypeLabel } from './format.ts'
import {
  demoQuestionLabel,
  placeholderPrompt,
} from './placeholders.ts'
import chevronRightUrl from './assets/chevron-right.svg'

export interface MistakeQuestionRowProps {
  question: QuestionRecord
  listIndex: number
  lastAnswerLabel: string
  onOpen: (question: QuestionRecord) => void
}

export function MistakeQuestionRow({
  question,
  listIndex,
  lastAnswerLabel,
  onOpen,
}: MistakeQuestionRowProps) {
  const handleOpen = () => {
    onOpen(question)
  }

  return (
    <button
      type="button"
      className="figma-mistakes-row"
      onClick={handleOpen}
      aria-label={`Otwórz ćwiczenie ${demoQuestionLabel(question.number)}`}
    >
      <div className="figma-mistakes-row-body">
        <div className="figma-mistakes-row-meta">
          <p className="figma-mistakes-row-id">{demoQuestionLabel(question.number)}</p>
          <p className="figma-mistakes-row-type">{answerTypeLabel(question.scope)}</p>
        </div>
        <p className="figma-mistakes-row-prompt">{placeholderPrompt(listIndex)}</p>
        <p className="figma-mistakes-row-status">
          Ostatnio: {lastAnswerLabel} · niepoprawnie
        </p>
      </div>
      <span className="figma-mistakes-row-chevron" aria-hidden="true">
        <img src={chevronRightUrl} alt="" width={16} height={16} />
      </span>
    </button>
  )
}
