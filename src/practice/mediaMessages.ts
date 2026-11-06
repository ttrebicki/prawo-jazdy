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
    return `W tym archiwum nie ma pliku „${question.mediaFilename}”. To pytanie możesz rozwiązać bez obrazu.`
  }
  if (media?.reason === 'truncated') {
    return `Plik „${question.mediaFilename}” jest ucięty w archiwum. To pytanie możesz rozwiązać bez obrazu — pozostałe pytania działają.`
  }
  if (media?.reason === 'not_attached') {
    return 'Nie wskazano archiwum ZIP ze zdjęciami. Wskaż plik na ekranie multimediów albo rozwiąż to pytanie bez obrazu.'
  }
  return null
}

export const NO_MEDIA_LABEL = 'Pytanie bez multimediów'
