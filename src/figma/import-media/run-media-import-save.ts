import type { StudyApp } from '../../app/study-app.ts'
import { ACTIVE_CATEGORY } from '../../domain/types.ts'
import { importZipImagesFromFile } from '../../storage/app-database.ts'
import { formatZipReadProgress } from '../../storage/zip-read.ts'
import type { MediaImportSavePayload, MediaImportSaveResult } from './types.ts'

export type MediaImportProgressUpdate = {
  message: string
}

/** Imports a user-selected ZIP already on disk (no in-app gov.pl download). */
export async function runMediaImportSave(
  studyApp: StudyApp,
  payload: MediaImportSavePayload,
  onProgress?: (update: MediaImportProgressUpdate) => void,
): Promise<MediaImportSaveResult> {
  if (payload.kind !== 'file') {
    throw new Error(
      'Import multimediów wymaga wskazania pliku ZIP pobranego z gov.pl.',
    )
  }

  onProgress?.({ message: 'Odczyt archiwum… 0%.' })
  const result = await importZipImagesFromFile(payload.file, (progress) => {
    onProgress?.({ message: formatZipReadProgress(progress) })
  })
  await studyApp.refreshMediaIndex()
  return {
    stored: result.stored,
    skipped: result.skipped,
    wmvGaps: result.wmvGaps,
  }
}

export function countCategoryBWithoutViewableMedia(studyApp: StudyApp): number {
  return studyApp.bank.countMissingDisplayableMedia(
    ACTIVE_CATEGORY,
    studyApp.hasImageOnDevice,
  )
}
