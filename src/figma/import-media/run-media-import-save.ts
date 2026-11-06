import type { StudyApp } from '../../app/study-app.ts'
import { ACTIVE_CATEGORY } from '../../domain/types.ts'
import type { MediaImportSavePayload, MediaImportSaveResult } from './types.ts'

export type MediaImportProgressUpdate = {
  message: string
}

/** Links a ZIP that is already on disk. Does not unpack or upload the archive. */
export async function runMediaImportSave(
  studyApp: StudyApp,
  payload: MediaImportSavePayload,
  onProgress?: (update: MediaImportProgressUpdate) => void,
): Promise<MediaImportSaveResult> {
  if (payload.kind !== 'file') {
    throw new Error(
      'Wskaż plik ZIP z dysku. Aplikacja nie pobiera całego archiwum.',
    )
  }

  const linked = await studyApp.attachMediaZip(payload.file, payload.handle ?? null, (message) => {
    onProgress?.({ message })
  })
  return {
    stored: 0,
    skipped: 0,
    wmvGaps: 0,
    linkedName: linked.fileName,
    entryCount: linked.entryCount,
  }
}

export function countCategoryBWithoutViewableMedia(studyApp: StudyApp): number {
  return studyApp.bank.countMissingDisplayableMedia(
    ACTIVE_CATEGORY,
    studyApp.hasImageOnDevice,
  )
}
