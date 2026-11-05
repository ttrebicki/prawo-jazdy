import { describe, expect, it } from 'vitest'
import {
  isMediaZipFile,
  mediaZipValidationError,
  OFFICIAL_MEDIA_ZIP_URL,
} from '../src/figma/import-media/media-zip-file.ts'

describe('isMediaZipFile', () => {
  it('accepts .zip extension', () => {
    expect(isMediaZipFile(new File([], 'multimedia_do_pytan.zip'))).toBe(true)
  })

  it('rejects non-zip files', () => {
    expect(isMediaZipFile(new File([], 'katalog.xlsx'))).toBe(false)
  })

  it('error message cites official gov.pl URL', () => {
    expect(mediaZipValidationError('katalog.xlsx')).toContain(OFFICIAL_MEDIA_ZIP_URL)
  })
})
