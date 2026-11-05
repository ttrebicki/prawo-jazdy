import { useEffect, useMemo, useState } from 'react'
import {
  formatScopeLabel,
  isMediaViewable,
  resolveMediaForQuestion,
} from '../../domain/question-bank.ts'
import {
  formatUserAnswerLabel,
  getCorrectAnswerKey,
  type UserAnswer,
} from '../../domain/progress-store.ts'
import type { MediaResolution, QuestionRecord } from '../../domain/types.ts'
import type { StudyApp } from '../../app/study-app.ts'

interface PracticeQuestionViewProps {
  app: StudyApp
  question: QuestionRecord
  onNext: (previous: QuestionRecord) => void
  onBack: () => void
}

export function PracticeQuestionView({
  app,
  question,
  onNext,
  onBack,
}: PracticeQuestionViewProps) {
  const [media, setMedia] = useState<MediaResolution | null>(null)
  const [picked, setPicked] = useState<UserAnswer | null>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    setPicked(null)
    setRevealed(false)
    void resolveMediaForQuestion(question, app.mediaLookup).then(setMedia)
  }, [app, question])

  const correctKey = useMemo(() => getCorrectAnswerKey(question), [question])

  const mediaViewable = media ? isMediaViewable(question, media) : false

  const mediaUrl = useMemo(() => {
    if (media?.blob) {
      return URL.createObjectURL(media.blob)
    }
    return null
  }, [media?.blob])

  useEffect(() => {
    return () => {
      if (mediaUrl) {
        URL.revokeObjectURL(mediaUrl)
      }
    }
  }, [mediaUrl])

  const submit = async (answer: UserAnswer) => {
    if (revealed) {
      return
    }
    setPicked(answer)
    setRevealed(true)
    await app.recordAnswer({
      number: question.number,
      category: 'B',
      userAnswer: answer,
      correctAnswer: correctKey,
      mediaViewable,
    })
  }

  const mediaGapMessage = () => {
    if (!question.mediaFilename) {
      return null
    }
    if (media?.reason === 'video_wmv') {
      return 'Klip WMV — ta przeglądarka nie odtwarza tego formatu. Odpowiedź bez obrazu nie liczy się jako opanowanie.'
    }
    if (media?.reason === 'missing_file') {
      return 'Brak pliku graficznego na urządzeniu. Zaimportuj archiwum ze zdjęciami albo kontynuuj bez obrazu.'
    }
    return null
  }

  const gap = mediaGapMessage()

  return (
    <div className="stack">
      <button type="button" className="btn btn-ghost" onClick={onBack}>
        ← Zakończ
      </button>

      <div className="media-box">
        {mediaUrl ? (
          <img src={mediaUrl} alt="Ilustracja do pytania egzaminacyjnego" />
        ) : gap ? (
          <div className="media-gap">{gap}</div>
        ) : (
          <div className="media-gap muted">Pytanie bez multimediów</div>
        )}
      </div>

      <div className="chip-row">
        <span className="chip">{formatScopeLabel(question.scope)}</span>
        <span className="chip">{question.points} pkt</span>
        <span className="chip">Nr {question.number}</span>
      </div>

      <p>{question.prompt}</p>

      {!revealed ? (
        <div className="answer-grid">
          {question.scope === 'basic' ? (
            <>
              <button type="button" className="btn" onClick={() => void submit('T')}>
                TAK
              </button>
              <button type="button" className="btn" onClick={() => void submit('N')}>
                NIE
              </button>
            </>
          ) : (
            (['A', 'B', 'C'] as const).map((key) => (
              <button
                key={key}
                type="button"
                className="btn"
                onClick={() => void submit(key)}
              >
                {key}:{' '}
                {key === 'A'
                  ? question.answerA
                  : key === 'B'
                    ? question.answerB
                    : question.answerC}
              </button>
            ))
          )}
        </div>
      ) : (
        <div className="card stack">
          <p
            className={
              picked === correctKey ? 'feedback-correct' : 'feedback-incorrect'
            }
          >
            {picked === correctKey ? 'Poprawnie' : 'Błędnie'}
          </p>
          <p>
            Twoja odpowiedź: {picked ? formatUserAnswerLabel(picked) : '—'}
            <br />
            Prawidłowa: {formatUserAnswerLabel(correctKey)}
          </p>
          {picked === correctKey && !mediaViewable && question.mediaKind !== 'none' && (
            <p className="muted">
              Bez obrazu lub klipu odpowiedź nie jest zaliczana jako opanowanie.
            </p>
          )}
          <button
            type="button"
            className="btn"
            onClick={() => onNext(question)}
          >
            Dalej
          </button>
        </div>
      )}
    </div>
  )
}
