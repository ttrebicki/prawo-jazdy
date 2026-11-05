import type { MediaImportResultViewModel, MediaImportSaveResult } from './types.ts'

export function buildMediaImportResultViewModel(
  importResult: MediaImportSaveResult,
  questionsBWithoutMedia: number,
  catalogDateLabel: string,
): MediaImportResultViewModel {
  return {
    imagesFound: importResult.stored,
    clipsStored: importResult.wmvGaps,
    questionsBWithoutMedia,
    catalogDateLabel,
  }
}
