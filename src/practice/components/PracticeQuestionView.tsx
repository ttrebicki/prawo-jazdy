import { useEffect, useMemo, useState } from 'react'
import { formatScopeLabel } from '../../domain/question-bank.ts'
import {
  getCorrectAnswerKey,
  type UserAnswer,
} from '../../domain/progress-store.ts'
import type { QuestionRecord } from '../../domain/types.ts'
import { AnswerButtons } from './AnswerButtons.tsx'
import { FeedbackPanel } from './FeedbackPanel.tsx'
import { QuestionMedia } from './QuestionMedia.tsx'
import { useQuestionMedia } from '../hooks/useQuestionMedia.ts'
import type { PracticeDependencies } from '../types.ts'

interface PracticeQuestionViewProps {
  deps: PracticeDependencies
  question: QuestionRecord
  onNext: (previous: QuestionRecord) => void
  onBack: () => void
}

export function PracticeQuestionView({
  deps,
  question,
  onNext,
  onBack,
}: PracticeQuestionViewProps) {
  const [picked, setPicked] = useState<UserAnswer | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [whyText, setWhyText] = useState<string | null>(null)

  const { media, mediaViewable, mediaUrl } = useQuestionMedia(
    question,
    deps.mediaLookup,
  )

  useEffect(() => {
    setPicked(null)
    setRevealed(false)
    setWhyText(null)
  }, [question.number])

  useEffect(() => {
    if (!revealed) {
      setWhyText(null)
      return
    }
    let cancelled = false
    void deps.getExplanation(question.number).then((text) => {
      if (cancelled) {
        return
      }
      const trimmed = text?.trim()
      setWhyText(trimmed ? trimmed : null)
    })
    return () => {
      cancelled = true
    }
  }, [deps, question.number, revealed])

  const correctKey = useMemo(() => getCorrectAnswerKey(question), [question])

  const submit = async (answer: UserAnswer) => {
    if (revealed) {
      return
    }
    setPicked(answer)
    setRevealed(true)
    await deps.recordAnswer({
      number: question.number,
      category: deps.category,
      userAnswer: answer,
      correctAnswer: correctKey,
      mediaViewable,
    })
  }

  return (
    <div className="practice-screen">
      <header className="practice-header">
        <button
          type="button"
          className="practice-btn practice-btn-ghost"
          onClick={onBack}
        >
          ← Zakończ
        </button>
      </header>

      <QuestionMedia question={question} media={media} mediaUrl={mediaUrl} />

      <div className="practice-prompt-block">
        <div className="practice-chips">
          <span className="practice-chip">{formatScopeLabel(question.scope)}</span>
          <span className="practice-chip">{question.points} pkt</span>
          <span className="practice-chip">Nr {question.number}</span>
        </div>
        <p className="practice-prompt">{question.prompt}</p>
      </div>

      <div className="practice-thumb-zone">
        {!revealed || !picked ? (
          <AnswerButtons
            question={question}
            disabled={revealed}
            onPick={(answer) => void submit(answer)}
          />
        ) : (
          <FeedbackPanel
            question={question}
            picked={picked}
            correctKey={correctKey}
            mediaViewable={mediaViewable}
            whyText={whyText}
            onContinue={() => onNext(question)}
          />
        )}
      </div>
    </div>
  )
}
