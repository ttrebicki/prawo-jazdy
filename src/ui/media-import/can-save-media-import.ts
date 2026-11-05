export type MediaImportActionKind = 'none' | 'pick' | 'download'

export type MediaImportDraft = {
  action: MediaImportActionKind
  pendingFile: File | null
  isDownloadConfirmed: boolean
}

export const emptyMediaImportDraft = (): MediaImportDraft => ({
  action: 'none',
  pendingFile: null,
  isDownloadConfirmed: false,
})

/** Save runs only after a ZIP is chosen or the user confirmed the gov.pl download action. */
export const isMediaImportSaveEnabled = (
  draft: MediaImportDraft,
  isBusy: boolean,
): boolean => {
  if (isBusy) {
    return false
  }
  if (draft.pendingFile !== null) {
    return true
  }
  if (draft.action === 'download' && draft.isDownloadConfirmed) {
    return true
  }
  return false
}
