import type { MediaResolution, QuestionRecord } from '../../domain/types.ts'
import {
  getMediaGapMessage,
  NO_MEDIA_LABEL,
} from '../mediaMessages.ts'

interface QuestionMediaProps {
  question: QuestionRecord
  media: MediaResolution | null
  mediaUrl: string | null
}

export function QuestionMedia({
  question,
  media,
  mediaUrl,
}: QuestionMediaProps) {
  const gap = getMediaGapMessage(question, media)

  return (
    <div className="practice-media" aria-live="polite">
      {mediaUrl ? (
        <img src={mediaUrl} alt="Ilustracja do pytania egzaminacyjnego" />
      ) : gap ? (
        <p className="practice-media-gap">{gap}</p>
      ) : (
        <p className="practice-media-gap practice-muted">{NO_MEDIA_LABEL}</p>
      )}
    </div>
  )
}
