import type { MediaResolution, QuestionRecord } from '../domain/types.ts'

export function getMediaGapMessage(
  question: QuestionRecord,
  media: MediaResolution | null,
): string | null {
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

export const NO_MEDIA_LABEL = 'Pytanie bez multimediów'
