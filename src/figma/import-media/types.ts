export type MediaImportSavePayload =
  | { kind: 'file'; file: File }
  | { kind: 'download' }

export type MediaImportSaveResult = {
  stored: number
  skipped: number
  wmvGaps: number
}

export type MediaImportResultViewModel = {
  imagesFound: number
  clipsStored: number
  questionsBWithoutMedia: number
  catalogDateLabel: string
}
