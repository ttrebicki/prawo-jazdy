import { useEffect, useMemo, useState } from 'react'
import { useFigmaLayoutOptional } from '../../layout/FigmaLayoutContext.tsx'
import {
  getCorrectAnswerKey,
  type UserAnswer,
} from '../../../domain/progress-store.ts'
import type { QuestionRecord } from '../../../domain/types.ts'
import { displayExplanationText } from '../../../practice/explanationMessages.ts'
import { getMediaGapMessage } from '../../../practice/mediaMessages.ts'
import { useQuestionMedia } from '../../../practice/hooks/useQuestionMedia.ts'
import type { PracticeDependencies } from '../../../practice/types.ts'
import { figmaPracticeAssets } from '../assets.ts'
import type { FigmaPracticeTheme } from '../theme.ts'
import { PracticeAnswerList } from './PracticeAnswerList.tsx'
import { PracticeFrame } from './PracticeFrame.tsx'
import { PracticeMediaCard, PracticeTextOnlyHint } from './PracticeMediaArea.tsx'
import { PracticeMetaProgress } from './PracticeMetaProgress.tsx'
import { PracticeQuestionCopy } from './PracticeQuestionCopy.tsx'
import { PracticeResultBlock } from './PracticeResultBlock.tsx'
import { PracticeWhyPanel } from './PracticeWhyPanel.tsx'

interface FigmaPracticeQuestionViewProps {
  deps: PracticeDependencies
  question: QuestionRecord
  questionIndex: number
  questionTotal: number
  theme?: FigmaPracticeTheme
  onNext: (previous: QuestionRecord) => void
  onBack: () => void
}

function formatQuestionLabel(number: string): string {
  return `DEMO B-${number.padStart(4, '0')}`
}

export function FigmaPracticeQuestionView({
  deps,
  question,
  questionIndex,
  questionTotal,
  theme = 'light',
  onNext,
  onBack,
}: FigmaPracticeQuestionViewProps) {
  const assets = figmaPracticeAssets(theme)
  const [pendingAnswer, setPendingAnswer] = useState<UserAnswer | null>(null)
  const [picked, setPicked] = useState<UserAnswer | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [whyExpanded, setWhyExpanded] = useState(false)
  const [storedExplanation, setStoredExplanation] = useState<
    string | null | undefined
  >(undefined)

  const { media, mediaViewable, mediaUrl, progressLabel } = useQuestionMedia(
    question,
    deps.mediaLookup,
    deps.fetchQuestionImage,
    deps.fetchQuestionClip,
  )
  const mediaStatus = progressLabel ?? getMediaGapMessage(question, media)

  useEffect(() => {
    setPendingAnswer(null)
    setPicked(null)
    setRevealed(false)
    setWhyExpanded(false)
    setStoredExplanation(undefined)
    let cancelled = false
    void deps.getExplanation(question.number).then((text) => {
      if (cancelled) {
        return
      }
      const trimmed = text?.trim()
      setStoredExplanation(trimmed ? trimmed : null)
    })
    return () => {
      cancelled = true
    }
  }, [deps, question.number])

  const correctKey = useMemo(() => getCorrectAnswerKey(question), [question])
  const explanationReady = storedExplanation !== undefined
  const explanationText = displayExplanationText(storedExplanation ?? null)
  const hasMediaArea = question.mediaKind !== 'none'
  const progressRatio =
    questionTotal > 0 ? questionIndex / questionTotal : 0

  const submit = async () => {
    if (revealed || pendingAnswer === null) {
      return
    }
    setPicked(pendingAnswer)
    setRevealed(true)
    setWhyExpanded(true)
    await deps.recordAnswer({
      number: question.number,
      category: deps.category,
      userAnswer: pendingAnswer,
      correctAnswer: correctKey,
      mediaViewable,
    })
  }

  const showWhyExpanded =
    revealed || (whyExpanded && explanationReady)

  const whyToggle = () => {
    setWhyExpanded((open) => !open)
  }

  const footnote = revealed
    ? 'Wynik dotyczy wyłącznie treści pokazowej.'
    : 'To ćwiczenie demonstracyjne, nie pytanie egzaminacyjne.'

  const layout = useFigmaLayoutOptional()
  const themeClass = theme === 'dark' ? 'fp--dark' : 'fp--light'

  if (layout?.isWide) {
    return (
      <div
        className={`figma-wide__content fp-wide-themed ${themeClass}`}
        data-node-id={layout.isDesktop ? '15:12559' : '15:13531'}
        data-name={
          layout.isDesktop
            ? 'Desktop · Ćwiczenia · przed odpowiedzią'
            : 'Tablet · Ćwiczenia · przed odpowiedzią'
        }
      >
        <div className="figma-wide__practice-head">
          <h1 className="figma-wide__practice-title">Ćwiczenia</h1>
          <button type="button" className="figma-wide__practice-back" onClick={onBack}>
            Wróć na start
          </button>
        </div>

        <PracticeMetaProgress
          questionLabel={formatQuestionLabel(question.number)}
          progressLabel={`${questionIndex} z ${questionTotal}`}
          progressRatio={progressRatio}
        />

        {hasMediaArea ? (
          <PracticeMediaCard
            assets={assets}
            mediaUrl={mediaUrl}
            status={mediaStatus}
            video={question.mediaKind === 'video'}
          />
        ) : null}

        <div className="figma-wide__practice-grid">
          <div className="figma-wide__practice-main">
            {hasMediaArea ? null : <PracticeTextOnlyHint assets={assets} />}

            <PracticeQuestionCopy prompt={question.prompt} />

            <PracticeAnswerList
              question={question}
              assets={assets}
              mode={revealed ? 'review' : 'pick'}
              selected={pendingAnswer}
              picked={picked}
              correctKey={correctKey}
              onSelect={revealed ? undefined : setPendingAnswer}
            />

            {revealed && picked !== null ? (
              <PracticeResultBlock
                isCorrect={picked === correctKey}
                correctKey={correctKey}
              />
            ) : null}
          </div>

          <aside className="figma-wide__practice-side">
            {showWhyExpanded ? (
              <PracticeWhyPanel
                assets={assets}
                text={explanationText}
                expanded
                onToggle={whyToggle}
              />
            ) : (
              <PracticeWhyPanel
                assets={assets}
                text={explanationText}
                expanded={false}
                onToggle={() => setWhyExpanded(true)}
              />
            )}

            <button
              type="button"
              className="fp-primary-action"
              disabled={!revealed && pendingAnswer === null}
              onClick={() => {
                if (revealed) {
                  onNext(question)
                  return
                }
                void submit()
              }}
            >
              {revealed ? (
                <>
                  Następne pytanie
                  <img className="fp-icon fp-icon--18" src={assets.arrowRight} alt="" />
                </>
              ) : (
                'Sprawdź odpowiedź'
              )}
            </button>

            <p className="fp-footnote">{footnote}</p>
          </aside>
        </div>
      </div>
    )
  }

  return (
    <PracticeFrame theme={theme} onBack={onBack}>
      <PracticeMetaProgress
        questionLabel={formatQuestionLabel(question.number)}
        progressLabel={`${questionIndex} z ${questionTotal}`}
        progressRatio={progressRatio}
      />

      {hasMediaArea ? (
        <PracticeMediaCard
          assets={assets}
          mediaUrl={mediaUrl}
          status={mediaStatus}
          video={question.mediaKind === 'video'}
        />
      ) : (
        <PracticeTextOnlyHint assets={assets} />
      )}

      <PracticeQuestionCopy prompt={question.prompt} />

      <PracticeAnswerList
        question={question}
        assets={assets}
        mode={revealed ? 'review' : 'pick'}
        selected={pendingAnswer}
        picked={picked}
        correctKey={correctKey}
        onSelect={revealed ? undefined : setPendingAnswer}
      />

      {revealed && picked !== null ? (
        <PracticeResultBlock
          isCorrect={picked === correctKey}
          correctKey={correctKey}
        />
      ) : null}

      {showWhyExpanded ? (
        <PracticeWhyPanel
          assets={assets}
          text={explanationText}
          expanded
          onToggle={whyToggle}
        />
      ) : (
        <PracticeWhyPanel
          assets={assets}
          text={explanationText}
          expanded={false}
          onToggle={() => setWhyExpanded(true)}
        />
      )}

      <button
        type="button"
        className="fp-primary-action"
        disabled={!revealed && pendingAnswer === null}
        onClick={() => {
          if (revealed) {
            onNext(question)
            return
          }
          void submit()
        }}
      >
        {revealed ? (
          <>
            Następne pytanie
            <img className="fp-icon fp-icon--18" src={assets.arrowRight} alt="" />
          </>
        ) : (
          'Sprawdź odpowiedź'
        )}
      </button>

      <p className="fp-footnote">{footnote}</p>
    </PracticeFrame>
  )
}
