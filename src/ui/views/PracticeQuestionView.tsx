import { useEffect, useMemo, useState } from 'react'
import {
  formatScopeLabel,
  isMediaViewable,
  resolveMediaForQuestion,
} from '../../domain/question-bank.ts'
import { getMediaGapMessage } from '../../practice/mediaMessages.ts'
import { clipProgressLabel } from '../../storage/clip-progress.ts'
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
  const [progressLabel, setProgressLabel] = useState<string | null>(null)
  const [picked, setPicked] = useState<UserAnswer | null>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    let cancelled = false
    setPicked(null)
    setRevealed(false)
    setMedia(null)
    const filename = question.mediaFilename
    if (question.mediaKind === 'video' && filename) {
      setProgressLabel(clipProgressLabel({ phase: 'read', loaded: 0, total: 1 }))
      void app.fetchQuestionClip(filename, (progress) => {
        if (!cancelled) {
          setProgressLabel(clipProgressLabel(progress))
        }
      }).then((read) => {
        if (cancelled) {
          return
        }
        setProgressLabel(null)
        setMedia({
          kind: 'video',
          reason: read.reason,
          blob: read.blob,
          filename,
        })
      })
      return () => {
        cancelled = true
      }
    }
    if (question.mediaKind === 'image' && filename) {
      setProgressLabel('Wczytywanie pliku z archiwum… 0%')
      void app
        .fetchQuestionImage(filename, (loaded, total) => {
          if (cancelled) {
            return
          }
          const percent = total > 0 ? Math.min(100, Math.round((loaded / total) * 100)) : 0
          setProgressLabel(`Wczytywanie pliku z archiwum… ${percent}%`)
        })
        .then((read) => {
          if (cancelled) {
            return
          }
          setProgressLabel(null)
          setMedia({
            kind: 'image',
            reason: read.reason,
            blob: read.blob,
            filename,
          })
        })
      return () => {
        cancelled = true
      }
    }
    setProgressLabel(null)
    void resolveMediaForQuestion(question, app.mediaLookup).then((resolved) => {
      if (!cancelled) {
        setMedia(resolved)
      }
    })
    return () => {
      cancelled = true
    }
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

  const gap = progressLabel ?? getMediaGapMessage(question, media)

  return (
    <div className="stack">
      <button type="button" className="btn btn-ghost" onClick={onBack}>
        ← Zakończ
      </button>

      <div className={question.mediaKind === 'video' ? 'media-box media-box--stage' : 'media-box'}>
        {mediaUrl && (media?.kind === 'video' || question.mediaKind === 'video') ? (
          <video src={mediaUrl} controls playsInline preload="metadata" />
        ) : mediaUrl ? (
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
