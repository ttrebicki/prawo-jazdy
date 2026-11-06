import { useEffect, useMemo, useState } from 'react'
import {
  isMediaViewable,
  resolveMediaForQuestion,
  type MediaLookup,
} from '../../domain/question-bank.ts'
import type { MediaAvailabilityReason, MediaResolution, QuestionRecord } from '../../domain/types.ts'
import type { QuestionImageRead } from '../../storage/media-zip-library.ts'

const imageResolution = (
  question: QuestionRecord,
  read: QuestionImageRead,
): MediaResolution => ({
  kind: 'image',
  reason: read.reason,
  blob: read.blob,
  filename: question.mediaFilename,
})

export function useQuestionMedia(
  question: QuestionRecord,
  mediaLookup: MediaLookup,
  fetchQuestionImage?: (
    filename: string,
    onProgress?: (loaded: number, total: number) => void,
  ) => Promise<QuestionImageRead>,
) {
  const [media, setMedia] = useState<MediaResolution | null>(null)
  const [progressLabel, setProgressLabel] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setMedia(null)

    const filename = question.mediaFilename
    if (question.mediaKind === 'image' && filename && fetchQuestionImage) {
      setProgressLabel('Wczytywanie pliku z archiwum… 0%')
      void fetchQuestionImage(filename, (loaded, total) => {
        if (cancelled) {
          return
        }
        const percent = total > 0 ? Math.min(100, Math.round((loaded / total) * 100)) : 0
        setProgressLabel(`Wczytywanie pliku z archiwum… ${percent}%`)
      }).then((read) => {
        if (cancelled) {
          return
        }
        setProgressLabel(null)
        setMedia(imageResolution(question, read))
      })
      return () => {
        cancelled = true
      }
    }

    setProgressLabel(null)
    void resolveMediaForQuestion(question, mediaLookup).then((resolved) => {
      if (!cancelled) {
        setMedia(resolved)
      }
    })
    return () => {
      cancelled = true
    }
  }, [question, mediaLookup, fetchQuestionImage])

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

  return { media, mediaViewable, mediaUrl, progressLabel }
}

export type { MediaAvailabilityReason }
