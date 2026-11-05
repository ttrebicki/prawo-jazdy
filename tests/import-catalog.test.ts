import { describe, expect, it } from 'vitest'
import { importCatalogRows, mapCatalogRow } from '../src/domain/import-catalog.ts'
import { normalizeScope } from '../src/domain/normalize-scope.ts'

describe('normalizeScope', () => {
  it('maps workbook spellings including the known typo', () => {
    expect(normalizeScope('PODSTAWOWY')).toBe('basic')
    expect(normalizeScope('Podstawowy')).toBe('basic')
    expect(normalizeScope('SPECJALISTYCZNY')).toBe('specialist')
    expect(normalizeScope('Specajlistyczny')).toBe('specialist')
  })
})

describe('mapCatalogRow', () => {
  it('maps a basic TAK/NIE row with categories and WMV media', () => {
    const row = {
      'Numer pytania': '9001',
      Pytanie: 'Przykładowe pytanie podstawowe?',
      'Odpowiedź A': '',
      'Odpowiedź B': '',
      'Odpowiedź C': '',
      'Poprawna odp': 'T',
      Media: 'clip_przyklad.wmv',
      'Zakres struktury': 'PODSTAWOWY',
      'Liczba punktów': '3',
      Kategorie: 'B,AM',
    }
    const q = mapCatalogRow(row)
    expect(q).toMatchObject({
      number: '9001',
      scope: 'basic',
      basicKey: 'T',
      points: 3,
      categories: ['B', 'AM'],
      mediaKind: 'video',
    })
  })

  it('maps a specialist row with three answers', () => {
    const row = {
      'Numer pytania': '9002',
      Pytanie: 'Która odpowiedź jest poprawna?',
      'Odpowiedź A': 'Alpha',
      'Odpowiedź B': 'Beta',
      'Odpowiedź C': 'Gamma',
      'Poprawna odp': 'B',
      Media: 'foto_przyklad.jpg',
      'Zakres struktury': 'Specjalistyczny',
      'Liczba punktów': '2',
      Kategorie: 'B',
    }
    const q = mapCatalogRow(row)
    expect(q).toMatchObject({
      number: '9002',
      scope: 'specialist',
      specialistKey: 'B',
      answerB: 'Beta',
      mediaKind: 'image',
    })
  })

  it('skips blank official numbers', () => {
    expect(mapCatalogRow({ 'Numer pytania': '' })).toBeNull()
  })
})

describe('importCatalogRows', () => {
  it('aggregates stats and ignores blank rows', () => {
    const { questions, stats } = importCatalogRows([
      {
        'Numer pytania': '1',
        Pytanie: 'P1',
        'Poprawna odp': 'N',
        'Zakres struktury': 'PODSTAWOWY',
        'Liczba punktów': '1',
        Kategorie: 'B',
        Media: '',
      },
      { 'Numer pytania': '' },
    ])
    expect(questions).toHaveLength(1)
    expect(stats.kept).toBe(1)
    expect(stats.blankRowsSkipped).toBe(1)
    expect(stats.noMediaInCatalog).toBe(1)
  })
})
