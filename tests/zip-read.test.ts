import { strToU8, zipSync } from 'fflate'
import { describe, expect, it } from 'vitest'
import {
  IncompleteMediaZipError,
  INCOMPLETE_MEDIA_ZIP_MESSAGE,
  formatZipReadProgress,
  ingestZipBytes,
  normalizeZipReadError,
} from '../src/storage/zip-read.ts'

describe('ingestZipBytes', () => {
  const complete = zipSync({
    'foto.jpg': strToU8('jpeg-bytes'),
  })

  it('accepts a finished archive', () => {
    expect(() => ingestZipBytes(complete)).not.toThrow()
  })

  it('rejects a truncated archive instead of treating it as imported', () => {
    const truncated = complete.slice(0, 48)
    expect(() => ingestZipBytes(truncated)).toThrow(IncompleteMediaZipError)
    expect(() => ingestZipBytes(truncated)).toThrow(INCOMPLETE_MEDIA_ZIP_MESSAGE)
  })
})

describe('normalizeZipReadError', () => {
  it('maps fflate unexpected EOF onto the Polish incomplete-file error', () => {
    const eof = new Error('unexpected EOF') as Error & { code: number }
    eof.code = 0
    const normalized = normalizeZipReadError(eof)
    expect(normalized).toBeInstanceOf(IncompleteMediaZipError)
    expect(normalized.message).toContain('niekompletny')
    expect(normalized.message).not.toContain('unexpected EOF')
  })
})

describe('formatZipReadProgress', () => {
  it('shows percent read and how many images were stored', () => {
    const line = formatZipReadProgress({
      bytesRead: 2_500_000_000,
      totalBytes: 10_000_000_000,
      filesProcessed: 40,
      stored: 12,
    })
    expect(line).toContain('25%')
    expect(line).toContain('zapisane zdjęcia: 12')
    expect(line).toContain('przejrzane pliki: 40')
  })
})
