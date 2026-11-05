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
  const persist = async (
    result: Awaited<ReturnType<typeof importZipImagesFromFile>>,
  ): Promise<MediaImportSaveResult> => {
    await studyApp.refreshMediaIndex()
    return {
      stored: result.stored,
      skipped: result.skipped,
      /** WMV gap markers in storage — not the „Zapisane klipy” figure on the result screen. */
      wmvGaps: result.wmvGaps,
    }
  }

  if (payload.kind === 'file') {
    return persist(await importZipImagesFromFile(payload.file))
  }

  const response = await fetch(OFFICIAL_MEDIA_ZIP_URL)
  if (!response.ok) {
    throw new Error(`Serwer zwrócił ${response.status}`)
  }
  return persist(await importZipImagesFromResponse(response))
}

export function countCategoryBWithoutViewableMedia(studyApp: StudyApp): number {
  return studyApp.bank.countMissingDisplayableMedia(
    ACTIVE_CATEGORY,
    studyApp.hasImageOnDevice,
  )
}
