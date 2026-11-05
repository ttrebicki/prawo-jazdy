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

/** User- or app-authored hint keyed by official catalog number (not in the workbook). */
export interface QuestionExplanation {
  officialNumber: string
  text: string
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

/** Canonical names exported from `index.ts` for cross-package use. */
export type Scope = QuestionScope

export type QuestionKind = 'yes-no' | 'abc'

export type AnswerKey = BasicKey | SpecialistKey

export interface QuestionAnswers {
  a: string
  b: string
  c: string
}

export interface Question {
  officialNumber: string
  catalogFilename: string
  catalogModifiedAt: string | null
  scope: Scope
  points: 1 | 2 | 3
  categories: CategoryCode[]
  kind: QuestionKind
  prompt: string
  answers: QuestionAnswers | null
  key: AnswerKey
  mediaFilename: string | null
  mediaKind: MediaKind
}

export type MediaMissingReason =
  | 'none_needed'
  | 'available'
  | 'missing_file'
  | 'video_wmv'

export interface ResolvedMedia {
  kind: MediaKind
  reason: MediaMissingReason
  blob: Blob | null
  filename: string | null
}

export interface QuestionCatalogMeta {
  catalogFilename: string
  catalogModifiedAt: string | null
}

export interface QuestionListFilter {
  category: CategoryCode
  scope?: Scope
  points?: 1 | 2 | 3
}

export interface RecordAnswerParams {
  officialNumber: string
  category: CategoryCode
  userKey: AnswerKey
  correctKey: AnswerKey
  mediaViewable: boolean
  answeredAt?: string
}

export interface StudyProgress {
  officialNumber: string
  category: CategoryCode
  timesSeen: number
  timesCorrect: number
  lastOutcome: LastOutcome
  lastAnsweredAt: string | null
}

export interface ExamSession {
  id: string
  category: CategoryCode
  mode: 'practice' | 'exam'
  officialNumbers: string[]
  finishedAt: string | null
}

export interface QuestionBank {
  setCatalog(questions: Question[], meta: QuestionCatalogMeta): void
  listQuestions(filter: QuestionListFilter): Question[]
  getByOfficialNumber(officialNumber: string): Question | undefined
  resolveMedia(
    question: Question,
    hasFileOnDevice: (filename: string) => boolean,
  ): ResolvedMedia
}

export interface ProgressStore {
  recordAnswer(params: RecordAnswerParams): StudyProgress
  getProgress(
    officialNumber: string,
    category: CategoryCode,
  ): StudyProgress | undefined
  listMistakes(category: CategoryCode): StudyProgress[]
  listPastPapers(category: CategoryCode): ExamSession[]
  reconcileAfterImport(
    category: CategoryCode,
    liveOfficialNumbers: ReadonlySet<string>,
  ): string[]
}

