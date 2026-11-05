import * as XLSX from 'xlsx'
import { describe, expect, it } from 'vitest'
import {
  importCatalogRows,
  isBlankCatalogRow,
  mapCatalogRow,
  parseWorkbookBuffer,
} from '../src/domain/import-catalog.ts'
import { VERIFICATION_SHEET } from '../src/domain/constants.ts'
import { normalizeScope } from '../src/domain/normalize-scope.ts'

const HEADER_ROW = [
  'Numer pytania',
  'Pytanie',
  'Odpowiedź A',
  'Odpowiedź B',
  'Odpowiedź C',
  'Poprawna odp',
  'Media',
  'Zakres struktury',
  'Liczba punktów',
  'Kategorie',
] as const

describe('normalizeScope', () => {
  it('maps workbook spellings including the known typo', () => {
    expect(normalizeScope('PODSTAWOWY')).toBe('basic')
    expect(normalizeScope('Podstawowy')).toBe('basic')
    expect(normalizeScope('SPECJALISTYCZNY')).toBe('specialist')
    expect(normalizeScope('Specajlistyczny')).toBe('specialist')
  })
})

describe('isBlankCatalogRow', () => {
  it('treats trailing empty rows as blank', () => {
    expect(isBlankCatalogRow({})).toBe(true)
    expect(
      isBlankCatalogRow({
        'Numer pytania': '',
        Pytanie: '',
        'Poprawna odp': '',
      }),
    ).toBe(true)
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
      'Poprawna odp': 'Tak',
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
      sourceSheet: 'katalog',
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
        'Poprawna odp': 'Nie',
        'Zakres struktury': 'PODSTAWOWY',
        'Liczba punktów': '1',
        Kategorie: 'B',
        Media: '',
      },
      { 'Numer pytania': '' },
      {},
    ])
    expect(questions).toHaveLength(1)
    expect(stats.kept).toBe(1)
    expect(stats.blankRowsSkipped).toBe(2)
    expect(stats.noMediaInCatalog).toBe(1)
  })
})

describe('parseWorkbookBuffer', () => {
  it('imports katalog only and counts verification rows', () => {
    const workbook = XLSX.utils.book_new()
    const header = [...HEADER_ROW]
    const katalogSheet = XLSX.utils.aoa_to_sheet([
      header,
      [
        '8001',
        'Fixture podstawowe?',
        '',
        '',
        '',
        'Nie',
        '',
        'PODSTAWOWY',
        '2',
        'B',
      ],
      ['', '', '', '', '', '', '', '', '', ''],
    ])
    const verificationSheet = XLSX.utils.aoa_to_sheet([
      header,
      [
        '7001',
        'Fixture weryfikacja?',
        '',
        '',
        '',
        'Tak',
        '',
        'PODSTAWOWY',
        '1',
        'B',
      ],
      [
        '7002',
        'Fixture weryfikacja dwa?',
        '',
        '',
        '',
        'Nie',
        '',
        'PODSTAWOWY',
        '1',
        'B',
      ],
    ])
    XLSX.utils.book_append_sheet(workbook, katalogSheet, 'katalog')
    XLSX.utils.book_append_sheet(workbook, verificationSheet, VERIFICATION_SHEET)

    const nodeBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'buffer',
    }) as Buffer
    const buffer = nodeBuffer.buffer.slice(
      nodeBuffer.byteOffset,
      nodeBuffer.byteOffset + nodeBuffer.byteLength,
    )
    const { questions, stats } = parseWorkbookBuffer(buffer)

    expect(questions).toHaveLength(1)
    expect(questions[0]?.number).toBe('8001')
    expect(stats.kept).toBe(1)
    expect(stats.verificationSkipped).toBe(2)
    expect(stats.blankRowsSkipped).toBe(1)
  })
})
