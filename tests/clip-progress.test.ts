import { describe, expect, it } from 'vitest'
import { getMediaGapMessage } from '../src/practice/mediaMessages.ts'
import { clipProgressLabel } from '../src/storage/clip-progress.ts'
import type { QuestionRecord } from '../src/domain/types.ts'

const clipQuestion = {
  number: '1',
  prompt: 'Pytanie',
  scope: 'basic',
  points: 3,
  categories: ['B'],
  mediaFilename: 'film.wmv',
  mediaKind: 'video',
  sourceSheet: 'katalog',
} satisfies QuestionRecord

describe('clipProgressLabel', () => {
  it('reports zip read and MP4 conversion separately', () => {
    expect(clipProgressLabel({ phase: 'read', loaded: 25, total: 100 })).toBe(
      'Wczytywanie klipu z archiwum… 25%',
    )
    expect(clipProgressLabel({ phase: 'convert', ratio: 0.4 })).toBe(
      'Konwertuję klip do MP4… 40%',
    )
  })
})

describe('getMediaGapMessage for a failed clip', () => {
  it('keeps a Polish error and does not claim the clip played', () => {
    const message = getMediaGapMessage(clipQuestion, {
      kind: 'video',
      reason: 'conversion_failed',
      blob: null,
      filename: 'film.wmv',
    })
    expect(message).toContain('Nie udało się przekonwertować')
    expect(message).toContain('film.wmv')
    expect(message).toContain('pozostałe pytania')
  })
})
