import { describe, expect, it } from 'vitest'
import {
  emptyMediaImportDraft,
  isMediaImportSaveEnabled,
} from '../src/ui/media-import/can-save-media-import.ts'

describe('isMediaImportSaveEnabled', () => {
  it('stays disabled with an empty draft', () => {
    expect(isMediaImportSaveEnabled(emptyMediaImportDraft(), false)).toBe(false)
  })

  it('enables save after the user chose a media zip', () => {
    const draft = {
      ...emptyMediaImportDraft(),
      action: 'pick' as const,
      pendingFile: new File([], 'multimedia.zip', { type: 'application/zip' }),
    }
    expect(isMediaImportSaveEnabled(draft, false)).toBe(true)
  })

  it('enables save when download from gov.pl was confirmed', () => {
    const draft = {
      ...emptyMediaImportDraft(),
      action: 'download' as const,
      isDownloadConfirmed: true,
    }
    expect(isMediaImportSaveEnabled(draft, false)).toBe(true)
  })

  it('does not enable save for download before confirmation', () => {
    const draft = {
      ...emptyMediaImportDraft(),
      action: 'download' as const,
      isDownloadConfirmed: false,
    }
    expect(isMediaImportSaveEnabled(draft, false)).toBe(false)
  })

  it('disables save while busy even with a pending file', () => {
    const draft = {
      ...emptyMediaImportDraft(),
      pendingFile: new File([], 'multimedia.zip', { type: 'application/zip' }),
    }
    expect(isMediaImportSaveEnabled(draft, true)).toBe(false)
  })
})
