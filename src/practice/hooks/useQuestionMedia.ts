import { useEffect, useMemo, useState } from 'react'
import {
  isMediaViewable,
  resolveMediaForQuestion,
  type MediaLookup,
} from '../../domain/question-bank.ts'
import type { MediaResolution, QuestionRecord } from '../../domain/types.ts'

export function useQuestionMedia(
  question: QuestionRecord,
  mediaLookup: MediaLookup,
) {
  const [media, setMedia] = useState<MediaResolution | null>(null)

  useEffect(() => {
    void resolveMediaForQuestion(question, mediaLookup).then(setMedia)
  }, [question, mediaLookup])

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

  return { media, mediaViewable, mediaUrl }
}
