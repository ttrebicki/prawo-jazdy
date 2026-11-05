import type { StudyApp } from '../../app/study-app.ts'
import { OFFICIAL_MEDIA_ZIP_URL } from '../../domain/constants.ts'
import { ACTIVE_CATEGORY } from '../../domain/types.ts'
import {
  importZipImagesFromFile,
  importZipImagesFromResponse,
} from '../../storage/app-database.ts'
import type { MediaImportSavePayload, MediaImportSaveResult } from './types.ts'

/** Persists media import without pulling the full gov.pl archive until save runs. */
export async function runMediaImportSave(
  studyApp: StudyApp,
  payload: MediaImportSavePayload,
): Promise<MediaImportSaveResult> {
  if (payload.kind === 'file') {
    const result = await importZipImagesFromFile(payload.file)
    await studyApp.refreshMediaIndex()
    return result
  }

  const response = await fetch(OFFICIAL_MEDIA_ZIP_URL)
  if (!response.ok) {
    throw new Error(`Serwer zwrócił ${response.status}`)
  }
  const result = await importZipImagesFromResponse(response)
  await studyApp.refreshMediaIndex()
  return result
}

export function countCategoryBWithoutViewableMedia(studyApp: StudyApp): number {
  return studyApp.bank.countMissingDisplayableMedia(
    ACTIVE_CATEGORY,
    studyApp.hasImageOnDevice,
  )
}
