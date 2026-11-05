import type { StudyApp } from '../../app/study-app.ts'
import { OFFICIAL_MEDIA_ZIP_URL } from '../../domain/constants.ts'
import { ACTIVE_CATEGORY } from '../../domain/types.ts'
import {
  importZipImagesFromFile,
} from '../../storage/app-database.ts'
import type { MediaImportSavePayload, MediaImportSaveResult } from './types.ts'

export type MediaImportProgressUpdate = {
  message: string
  percent?: number
}

const formatBytes = (bytes: number): string => {
  if (bytes < 1024) {
    return `${bytes} B`
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/** Persists media import; reports download and unpack progress when requested. */
export async function runMediaImportSave(
  studyApp: StudyApp,
  payload: MediaImportSavePayload,
  onProgress?: (update: MediaImportProgressUpdate) => void,
): Promise<MediaImportSaveResult> {
  const persist = async (
    result: Awaited<ReturnType<typeof importZipImagesFromFile>>,
  ): Promise<MediaImportSaveResult> => {
    await studyApp.refreshMediaIndex()
    return {
      stored: result.stored,
      skipped: result.skipped,
      wmvGaps: result.wmvGaps,
    }
  }

  if (payload.kind === 'file') {
    onProgress?.({ message: 'Import zdjęć z wybranego pliku…' })
    return persist(
      await importZipImagesFromFile(payload.file, (processed) => {
        onProgress?.({ message: `Zapis multimediów… (${processed} plików)` })
      }),
    )
  }

  onProgress?.({ message: 'Łączenie z serwerem gov.pl…', percent: 0 })
  const response = await fetch(OFFICIAL_MEDIA_ZIP_URL)
  if (!response.ok) {
    throw new Error(`Serwer zwrócił ${response.status}`)
  }
  if (!response.body) {
    throw new Error('Serwer nie zwrócił strumienia danych.')
  }

  const totalBytes = Number(response.headers.get('content-length')) || 0
  let loadedBytes = 0
  const reader = response.body.getReader()
  const chunks: Uint8Array[] = []

  while (true) {
    const { done, value } = await reader.read()
    if (done) {
      break
    }
    if (value) {
      chunks.push(value)
      loadedBytes += value.byteLength
    }
    const percent =
      totalBytes > 0
        ? Math.min(100, Math.round((loadedBytes / totalBytes) * 100))
        : undefined
    onProgress?.({
      message:
        totalBytes > 0
          ? `Pobieranie archiwum… ${percent}%`
          : `Pobieranie archiwum… ${formatBytes(loadedBytes)}`,
      percent,
    })
  }

  onProgress?.({ message: 'Rozpakowywanie i zapis zdjęć…', percent: 100 })
  const archive = new File(
    [new Blob(chunks as BlobPart[])],
    'multimedia.zip',
    {
      type: 'application/zip',
    },
  )

  return persist(
    await importZipImagesFromFile(archive, (processed) => {
      onProgress?.({ message: `Zapis multimediów… (${processed} plików)` })
    }),
  )
}

export function countCategoryBWithoutViewableMedia(studyApp: StudyApp): number {
  return studyApp.bank.countMissingDisplayableMedia(
    ACTIVE_CATEGORY,
    studyApp.hasImageOnDevice,
  )
}
