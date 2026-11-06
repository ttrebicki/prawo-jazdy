import { describe, expect, it } from 'vitest'
import { getMediaGapMessage } from '../src/practice/mediaMessages.ts'
import {
  clipBatchLabel,
  clipProgressLabel,
  isVideoZipName,
  prioritizeIds,
} from '../src/storage/clip-progress.ts'
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
      'Konwertuję ten klip… 40%',
    )
    expect(clipProgressLabel({ phase: 'queued' })).toContain('w tle')
  })
})

describe('background clip order', () => {
  it('keeps only wmv names from the central directory', () => {
    expect(isVideoZipName('media/klip.WMV')).toBe(true)
    expect(isVideoZipName('foto.jpg')).toBe(false)
  })

  it('puts the questions about to be seen ahead of the rest of the zip', () => {
    const pending = ['other.wmv', 'soon-b.wmv', 'later.wmv', 'soon-a.wmv']
    expect(prioritizeIds(pending, ['now.wmv', 'soon-a.wmv', 'soon-b.wmv'])).toEqual([
      'soon-a.wmv',
      'soon-b.wmv',
      'other.wmv',
      'later.wmv',
    ])
  })

  it('hides the quiet status once every clip has been tried', () => {
    expect(clipBatchLabel({ done: 1, failed: 0, total: 4 })).toBe(
      'Konwersja klipów w tle: 1 z 4',
    )
    expect(clipBatchLabel({ done: 3, failed: 1, total: 4 })).toBeNull()
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
