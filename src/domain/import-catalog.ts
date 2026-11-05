import * as XLSX from 'xlsx'
import { KATALOG_SHEET, VERIFICATION_SHEET } from './constants.ts'
import { normalizeScope } from './normalize-scope.ts'
import {
  classifyMediaFilename,
  parseCategoryCodes,
} from './parse-fields.ts'
import type {
  BasicKey,
  ImportStats,
  QuestionRecord,
  SpecialistKey,
} from './types.ts'

export type RawCatalogRow = Record<string, unknown>

const CATALOG_CELL_KEYS = [
  'Numer pytania',
  'Pytanie',
  'Poprawna odp',
  'Zakres struktury',
  'Liczba punktów',
  'Kategorie',
  'Media',
  'Odpowiedź A',
  'Odpowiedź B',
  'Odpowiedź C',
] as const

function cell(row: RawCatalogRow, key: string): string {
  const value = row[key]
  if (value === undefined || value === null) {
    return ''
  }
  return String(value).trim()
}

export function isBlankCatalogRow(row: RawCatalogRow): boolean {
  return CATALOG_CELL_KEYS.every((key) => !cell(row, key))
}

function parsePoints(raw: string): 1 | 2 | 3 | null {
  const n = Number.parseInt(raw, 10)
  if (n === 1 || n === 2 || n === 3) {
    return n
  }
  return null
}

function parseBasicKey(raw: string): BasicKey | null {
  const v = raw.trim().toUpperCase()
  if (v === 'T' || v === 'TAK') {
    return 'T'
  }
  if (v === 'N' || v === 'NIE') {
    return 'N'
  }
  return null
}

function parseSpecialistKey(raw: string): SpecialistKey | null {
  const v = raw.trim().toUpperCase()
  if (v === 'A' || v === 'B' || v === 'C') {
    return v
  }
  return null
}

export function mapCatalogRow(row: RawCatalogRow): QuestionRecord | null {
  if (isBlankCatalogRow(row)) {
    return null
  }

  const number = cell(row, 'Numer pytania')
  if (!number) {
    return null
  }

  const scope = normalizeScope(cell(row, 'Zakres struktury'))
  const points = parsePoints(cell(row, 'Liczba punktów'))
  const prompt = cell(row, 'Pytanie')
  if (!scope || !points || !prompt) {
    return null
  }

  const categories = parseCategoryCodes(cell(row, 'Kategorie'))
  const mediaFilename = cell(row, 'Media') || null
  const mediaKind = classifyMediaFilename(mediaFilename)
  const correct = cell(row, 'Poprawna odp')

  const answerA = cell(row, 'Odpowiedź A')
  const answerB = cell(row, 'Odpowiedź B')
  const answerC = cell(row, 'Odpowiedź C')

  if (scope === 'basic') {
    const basicKey = parseBasicKey(correct)
    if (!basicKey) {
      return null
    }
    return {
      number,
      prompt,
      scope,
      points,
      categories,
      basicKey,
      mediaFilename,
      mediaKind,
      sourceSheet: 'katalog',
    }
  }

  const specialistKey = parseSpecialistKey(correct)
  if (!specialistKey || !answerA || !answerB || !answerC) {
    return null
  }

  return {
    number,
    prompt,
    scope,
    points,
    categories,
    specialistKey,
    answerA,
    answerB,
    answerC,
    mediaFilename,
    mediaKind,
    sourceSheet: 'katalog',
  }
}

function countMediaStats(questions: QuestionRecord[]): Pick<
  ImportStats,
  'imagesInCatalog' | 'videosInCatalog' | 'noMediaInCatalog'
> {
  let imagesInCatalog = 0
  let videosInCatalog = 0
  let noMediaInCatalog = 0
  for (const question of questions) {
    if (question.mediaKind === 'image') {
      imagesInCatalog += 1
    } else if (question.mediaKind === 'video') {
      videosInCatalog += 1
    } else {
      noMediaInCatalog += 1
    }
  }
  return { imagesInCatalog, videosInCatalog, noMediaInCatalog }
}

export function importCatalogRows(rows: RawCatalogRow[]): {
  questions: QuestionRecord[]
  stats: ImportStats
} {
  let blankRowsSkipped = 0
  const questions: QuestionRecord[] = []

  for (const row of rows) {
    if (isBlankCatalogRow(row)) {
      blankRowsSkipped += 1
      continue
    }
    const mapped = mapCatalogRow(row)
    if (!mapped) {
      continue
    }
    questions.push(mapped)
  }

  const mediaStats = countMediaStats(questions)

  return {
    questions,
    stats: {
      kept: questions.length,
      verificationSkipped: 0,
      blankRowsSkipped,
      ...mediaStats,
    },
  }
}

function countVerificationRows(workbook: XLSX.WorkBook): number {
  const sheet = workbook.Sheets[VERIFICATION_SHEET]
  if (!sheet) {
    return 0
  }
  const rows = XLSX.utils.sheet_to_json<RawCatalogRow>(sheet, {
    defval: '',
  })
  let count = 0
  for (const row of rows) {
    if (isBlankCatalogRow(row)) {
      continue
    }
    if (cell(row, 'Numer pytania')) {
      count += 1
    }
  }
  return count
}

/** Reads only the live `katalog` sheet; verification rows are counted, not imported. */
export function parseWorkbookBuffer(buffer: ArrayBuffer): {
  questions: QuestionRecord[]
  stats: ImportStats
} {
  const workbook = XLSX.read(buffer, { type: 'array' })
  const sheet = workbook.Sheets[KATALOG_SHEET]
  if (!sheet) {
    throw new Error('Brak arkusza „katalog” w pliku.')
  }
  const rows = XLSX.utils.sheet_to_json<RawCatalogRow>(sheet, {
    defval: '',
  })
  const result = importCatalogRows(rows)
  result.stats.verificationSkipped = countVerificationRows(workbook)
  return result
}

export function mergeQuestionsByNumber(
  existing: QuestionRecord[],
  incoming: QuestionRecord[],
): QuestionRecord[] {
  const byNumber = new Map(existing.map((q) => [q.number, q]))
  for (const q of incoming) {
    byNumber.set(q.number, q)
  }
  return [...byNumber.values()].sort((a, b) =>
    a.number.localeCompare(b.number, 'pl', { numeric: true }),
  )
}
