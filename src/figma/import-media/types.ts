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
  /** Display count for „Zapisane klipy” (not tied to WMV gap storage). */
  clipsStored: number
  questionsBWithoutMedia: number
  /** Footnote line (Figma uses full „Przykładowy wynik · katalog z …”). */
  catalogDateLabel: string
}
