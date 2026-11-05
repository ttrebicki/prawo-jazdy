/** Category codes present in the July 2026 workbook (phase 3 unlocks the rest). */
export type CategoryCode =
  | 'AM'
  | 'A1'
  | 'A2'
  | 'A'
  | 'B1'
  | 'B'
  | 'C1'
  | 'C'
  | 'D1'
  | 'D'
  | 'T'
  | 'PT'

export type QuestionScope = 'basic' | 'specialist'

export type BasicKey = 'T' | 'N'

export type SpecialistKey = 'A' | 'B' | 'C'

export type MediaKind = 'image' | 'video' | 'none'

export type LastOutcome = 'unanswered' | 'correct' | 'incorrect'

export interface CatalogMeta {
  filename: string
  /** HTTP Last-Modified of the workbook, if known. */
  lastModified: string | null
  importedAt: string
}

export interface QuestionRecord {
  number: string
  prompt: string
  scope: QuestionScope
  points: 1 | 2 | 3
  categories: CategoryCode[]
  /** Basic: T/N as TAK/NIE. Specialist: three Polish answers. */
  basicKey?: BasicKey
  specialistKey?: SpecialistKey
  answerA?: string
  answerB?: string
  answerC?: string
  mediaFilename: string | null
  mediaKind: MediaKind
  sourceSheet: 'katalog'
}

export interface QuestionProgress {
  number: string
  category: CategoryCode
  timesSeen: number
  timesCorrect: number
  lastOutcome: LastOutcome
  lastAnsweredAt: string | null
}

export type MediaAvailabilityReason =
  | 'none_needed'
  | 'available'
  | 'missing_file'
  | 'video_wmv'
  | 'unsupported'

export interface MediaResolution {
  kind: MediaKind
  reason: MediaAvailabilityReason
  blob: Blob | null
  filename: string | null
}

export interface ImportStats {
  kept: number
  verificationSkipped: number
  blankRowsSkipped: number
  imagesInCatalog: number
  videosInCatalog: number
  noMediaInCatalog: number
}

export interface PracticeFilters {
  scopeBasic: boolean
  scopeSpecialist: boolean
  onlyUnseen: boolean
  onlyMistakes: boolean
  onlyWithPhoto: boolean
  onlyMissingFile: boolean
}

export const ACTIVE_CATEGORY: CategoryCode = 'B'

export const LOCKED_CATEGORIES: {
  code: CategoryCode
  label: string
  reason: string
}[] = [
  { code: 'AM', label: 'AM', reason: 'Odblokujemy w kolejnej fazie.' },
  { code: 'A1', label: 'A1', reason: 'Odblokujemy w kolejnej fazie.' },
  { code: 'A2', label: 'A2', reason: 'Odblokujemy w kolejnej fazie.' },
  { code: 'A', label: 'A', reason: 'Odblokujemy w kolejnej fazie.' },
  { code: 'B1', label: 'B1', reason: 'Odblokujemy w kolejnej fazie.' },
  { code: 'C1', label: 'C1', reason: 'Odblokujemy w kolejnej fazie.' },
  { code: 'C', label: 'C', reason: 'Odblokujemy w kolejnej fazie.' },
  { code: 'D1', label: 'D1', reason: 'Odblokujemy w kolejnej fazie.' },
  { code: 'D', label: 'D', reason: 'Odblokujemy w kolejnej fazie.' },
  { code: 'T', label: 'T', reason: 'Odblokujemy w kolejnej fazie.' },
  {
    code: 'PT',
    label: 'PT (pozwolenie)',
    reason: 'Odblokujemy w kolejnej fazie.',
  },
]

export const DEFAULT_PRACTICE_FILTERS: PracticeFilters = {
  scopeBasic: true,
  scopeSpecialist: true,
  onlyUnseen: false,
  onlyMistakes: false,
  onlyWithPhoto: false,
  onlyMissingFile: false,
}
